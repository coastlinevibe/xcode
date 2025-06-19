import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { Animation, AnimationFolder } from '../types/game';
import { ensureAuthenticated } from '../lib/supabase';

interface AnimationSettings {
  speed: number;
  loop: boolean;
  pingPong: boolean;
  reverse: boolean;
}

interface AnimationData {
  name: string;
  frames: string[];
  settings: AnimationSettings;
}

export interface SpriteData {
  id: string;
  name: string;
  animations: AnimationData[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveSpriteOptions {
  id?: string;
  name: string;
  animations: Animation[];
  folders: AnimationFolder[];
}

// Initialize storage and database
export const initializeStorage = async () => {
  try {
    // Check if we have valid Supabase configuration
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    // Create the storage bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      console.log('Creating storage bucket...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket(STORAGE_BUCKET, {
          public: false,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
          fileSizeLimit: '5MB',
        });

      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        return;
      }
    }

    // Create the sprites table if it doesn't exist
    const { error: createTableError } = await supabase
      .from('sprites')
      .select()
      .limit(1);

    if (createTableError?.message?.includes('relation "sprites" does not exist')) {
      console.log('Creating sprites table...');
      const { error: createTableError } = await supabase.rpc('create_sprites_table');
      if (createTableError) {
        console.error('Error creating table:', createTableError);
        return;
      }
    }

    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Convert base64 to blob
const base64ToBlob = async (base64: string) => {
  try {
    const response = await fetch(base64);
    return await response.blob();
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw error;
  }
};

// Save a sprite with its animations to Supabase
export const saveSprite = async ({ id, name, animations, folders }: SaveSpriteOptions) => {
  try {
    // Ensure user is authenticated before proceeding
    const { data: { user } } = await ensureAuthenticated();
    if (!user) {
      throw new Error('Failed to authenticate user');
    }

    // Save or update sprite
    const spriteResult = id 
      ? await supabase
          .from('sprites')
          .update({ name, animations })
          .eq('id', id)
          .select()
          .single()
      : await supabase
          .from('sprites')
          .insert({ 
            name, 
            animations,
            user_id: user.id
          })
          .select()
          .single();

    if (spriteResult.error) throw spriteResult.error;
    const spriteId = spriteResult.data.id;

    // Delete existing folders for this sprite
    const deleteFoldersResult = await supabase
      .from('animation_folders')
      .delete()
      .eq('sprite_id', spriteId);

    if (deleteFoldersResult.error) throw deleteFoldersResult.error;

    // Save new folders
    for (const folder of folders) {
      // Create folder
      const folderResult = await supabase
        .from('animation_folders')
        .insert({
          name: folder.name,
          sprite_id: spriteId
        })
        .select()
        .single();

      if (folderResult.error) throw folderResult.error;

      // Save folder items
      const folderItems = folder.animations.map(animationIndex => ({
        folder_id: folderResult.data.id,
        animation_index: animationIndex,
        sprite_id: spriteId
      }));

      const itemsResult = await supabase
        .from('animation_folder_items')
        .insert(folderItems);

      if (itemsResult.error) throw itemsResult.error;
    }

    return spriteResult.data;
  } catch (error) {
    console.error('Error saving sprite:', error);
    throw error;
  }
};

export const loadSprite = async (id: string) => {
  try {
    // Load sprite data
    const spriteResult = await supabase
      .from('sprites')
      .select('*')
      .eq('id', id)
      .single();

    if (spriteResult.error) throw spriteResult.error;

    // Load folders
    const foldersResult = await supabase
      .from('animation_folders')
      .select(`
        id,
        name,
        animation_folder_items (
          animation_index
        )
      `)
      .eq('sprite_id', id);

    if (foldersResult.error) throw foldersResult.error;

    // Convert to AnimationFolder format
    const folders: AnimationFolder[] = foldersResult.data.map(folder => ({
      id: folder.id,
      name: folder.name,
      animations: folder.animation_folder_items.map(item => item.animation_index),
      isOpen: false // Default to closed
    }));

    return {
      ...spriteResult.data,
      folders
    };
  } catch (error) {
    console.error('Error loading sprite:', error);
    throw error;
  }
};

// Delete a sprite and all its assets
export const deleteSprite = async (spriteId: string): Promise<void> => {
  try {
    // Delete all files in the sprite's folder
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([`sprites/${spriteId}`]);

    if (storageError) {
      console.error('Error deleting sprite files:', storageError);
      throw storageError;
    }

    // Delete sprite metadata from the database
    const { error: dbError } = await supabase
      .from('sprites')
      .delete()
      .match({ id: spriteId });

    if (dbError) {
      console.error('Error deleting sprite metadata:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error deleting sprite:', error);
    throw error;
  }
}; 