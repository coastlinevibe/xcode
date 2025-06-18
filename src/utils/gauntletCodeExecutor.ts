import { GameState, Character, Enemy, Collectible, Position, ExecutionStep, Generator, PowerUp } from '../types/game';
import { GAUNTLET_VOICE_LINES } from '../data/gauntletMechanics';

export class GauntletCodeExecutor {
  private gameState: GameState;
  private logs: string[] = [];
  private steps: ExecutionStep[] = [];
  private isRunning: boolean = false;
  private currentLine: number = 0;
  private codeLines: string[] = [];
  private generators: Generator[] = [];
  private powerUps: PowerUp[] = [];
  private voiceLines: { text: string, played: boolean }[] = [];
  private foodDecayRate: number = 1; // Food points lost per second
  private lastFoodDecay: number = Date.now();

  constructor(gameState: GameState) {
    this.gameState = { ...gameState };
    
    // Initialize generators from obstacles
    this.initializeGenerators();
    
    // Initialize voice lines
    this.initializeVoiceLines();
  }

  private initializeGenerators() {
    this.generators = [];
    this.gameState.obstacles.forEach((obstacle, index) => {
      if (obstacle.type === 'generator') {
        this.generators.push({
          id: `gen${index}`,
          position: { ...obstacle.position },
          type: obstacle.generatesType || 'grunt',
          health: obstacle.health || 50,
          maxHealth: obstacle.health || 50,
          generationRate: obstacle.generationRate || 15,
          lastGenerated: Date.now(),
          isActive: true
        });
      }
    });
  }

  private initializeVoiceLines() {
    this.voiceLines = GAUNTLET_VOICE_LINES.map(line => ({
      text: line.coding,
      played: false
    }));
  }

  async executeCode(code: string, onUpdate: (state: GameState, logs: string[], currentLine?: number, codeLines?: string[]) => void): Promise<void> {
    this.logs = [];
    this.steps = [];
    this.isRunning = true;
    this.currentLine = 0;

    try {
      // Process the code to expand bracket notation
      const expandedCode = this.expandBracketNotation(code);
      this.codeLines = expandedCode.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
      
      this.addLog('🚀 Starting Gauntlet code execution...');
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Execute line by line with animation
      await this.executeStepByStep(expandedCode, onUpdate);
      
      this.addLog('✅ Code execution completed successfully!');
      
      // Check win condition
      if (this.checkWinCondition()) {
        this.addLog('🎉 Level completed! Well done!');
        this.gameState.isComplete = true;
      }
      
    } catch (error) {
      this.addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.gameState.gameOver = true;
    } finally {
      this.isRunning = false;
      this.currentLine = -1;
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
    }
  }

  private async executeStepByStep(code: string, onUpdate: (state: GameState, logs: string[], currentLine?: number, codeLines?: string[]) => void): Promise<void> {
    const lines = code.split('\n');
    let executableLineIndex = 0;
    const startTime = Date.now();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('//')) {
        continue;
      }

      // Update current line for highlighting
      this.currentLine = executableLineIndex;
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Add delay for visual effect
      await this.delay(800);
      
      // Execute the line
      await this.executeLine(line);
      
      // Update game state (generators, food decay, etc.)
      this.updateGameState(startTime);
      
      // Update state after execution
      onUpdate(this.gameState, this.logs, this.currentLine, this.codeLines);
      
      // Check for game over
      if (this.gameState.gameOver || this.gameState.isComplete) {
        break;
      }
      
      executableLineIndex++;
      
      // Add delay between commands
      await this.delay(400);
    }
  }

  private updateGameState(startTime: number) {
    const currentTime = Date.now();
    
    // Update food (health) decay - Gauntlet style
    if (currentTime - this.lastFoodDecay >= 1000) { // Every second
      const secondsPassed = Math.floor((currentTime - this.lastFoodDecay) / 1000);
      this.gameState.food = Math.max(0, this.gameState.food - (this.foodDecayRate * secondsPassed));
      this.lastFoodDecay = currentTime;
      
      // Check if food is critically low
      if (this.gameState.food < 20 && !this.voiceLines[0].played) {
        this.addLog(`🔊 "${this.gameState.character.name} needs food, badly!"`);
        this.voiceLines[0].played = true;
      }
      
      // Check if food is depleted
      if (this.gameState.food <= 0 && this.gameState.health > 0) {
        this.gameState.health -= 5; // Start losing health when food is gone
        this.addLog('⚠️ No food left! Losing health!');
        
        if (this.gameState.health <= 0) {
          this.addLog('💀 You have starved to death!');
          this.gameState.gameOver = true;
        }
      }
    }
    
    // Update generators
    this.updateGenerators();
    
    // Update power-ups
    this.updatePowerUps(currentTime);
    
    // Update time
    this.gameState.time = Math.floor((currentTime - startTime) / 1000);
  }

  private updateGenerators() {
    const currentTime = Date.now();
    
    this.generators.forEach(generator => {
      if (generator.isActive && currentTime - generator.lastGenerated >= generator.generationRate * 1000) {
        // Spawn a new enemy
        this.spawnEnemyFromGenerator(generator);
        generator.lastGenerated = currentTime;
      }
    });
  }

  private spawnEnemyFromGenerator(generator: Generator) {
    // Find a valid position near the generator
    const spawnPositions = [
      { x: generator.position.x + 1, y: generator.position.y },
      { x: generator.position.x - 1, y: generator.position.y },
      { x: generator.position.x, y: generator.position.y + 1 },
      { x: generator.position.x, y: generator.position.y - 1 }
    ];
    
    // Filter valid positions (not walls, not occupied)
    const validPositions = spawnPositions.filter(pos => {
      // Check if position is within grid
      if (pos.x < 0 || pos.y < 0) return false;
      
      // Check if position has a wall
      const hasWall = this.gameState.obstacles.some(
        obs => obs.position.x === pos.x && obs.position.y === pos.y && obs.type === 'wall'
      );
      if (hasWall) return false;
      
      // Check if position has an enemy
      const hasEnemy = this.gameState.enemies.some(
        enemy => enemy.position.x === pos.x && enemy.position.y === pos.y && enemy.isAlive
      );
      if (hasEnemy) return false;
      
      // Check if position has the player
      if (this.gameState.character.position.x === pos.x && this.gameState.character.position.y === pos.y) {
        return false;
      }
      
      return true;
    });
    
    if (validPositions.length > 0) {
      // Choose a random valid position
      const spawnPos = validPositions[Math.floor(Math.random() * validPositions.length)];
      
      // Create a new enemy
      const newEnemy = {
        id: `${generator.type}${Date.now()}`,
        type: generator.type as any,
        position: { ...spawnPos },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 1,
        behavior: 'chase' as const,
        spawnedFromGenerator: true,
        generatorId: generator.id
      };
      
      // Add to game state
      this.gameState.enemies.push(newEnemy);
      this.addLog(`⚠️ A ${generator.type} spawned from generator at (${generator.position.x}, ${generator.position.y})!`);
    }
  }

  private updatePowerUps(currentTime: number) {
    // Check for expired power-ups
    this.powerUps = this.powerUps.filter(powerUp => {
      const isExpired = currentTime - powerUp.startTime >= powerUp.duration * 1000;
      if (isExpired && powerUp.isActive) {
        this.addLog(`🧪 ${powerUp.type} power-up has expired!`);
        return false;
      }
      return true;
    });
    
    // Update active effects in game state
    this.gameState.activeEffects = this.powerUps
      .filter(p => p.isActive)
      .map(p => p.type);
  }

  private async executeLine(line: string): Promise<void> {
    this.addLog(`🔄 Executing: ${line}`);
    
    try {
      // Create hero API for this line
      const hero = this.createHeroAPI();
      
      // Execute the single line
      const func = new Function('hero', line);
      await func(hero);
      
    } catch (error) {
      throw new Error(`Failed to execute "${line}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private expandBracketNotation(code: string): string {
    const lines = code.split('\n');
    const expandedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        expandedLines.push(line);
        continue;
      }

      // Check for bracket notation patterns:
      // hero.moveRight(3) or hero.moveRight[3] or hero.moveRight(3);
      const bracketMatch = trimmedLine.match(/^(\s*)(hero\.\w+)\s*[\(\[](\d+)[\)\]]\s*;?\s*$/);
      
      if (bracketMatch) {
        const [, indent, command, countStr] = bracketMatch;
        const count = parseInt(countStr, 10);
        
        // Validate count
        if (count > 0 && count <= 20) { // Limit to prevent infinite loops
          // Repeat the command the specified number of times
          for (let i = 0; i < count; i++) {
            expandedLines.push(`${indent}${command}();`);
          }
          
          this.addLog(`📝 Expanded: "${command}" repeated ${count} times`);
        } else {
          this.addLog(`⚠️ Invalid repeat count: ${count}. Using 1 instead.`);
          expandedLines.push(`${indent}${command}();`);
        }
      } else {
        // Keep the line as is, but ensure it ends with semicolon if it's a hero command
        if (trimmedLine.includes('hero.') && !trimmedLine.endsWith(';') && !trimmedLine.includes('(')) {
          expandedLines.push(line + '();');
        } else {
          expandedLines.push(line);
        }
      }
    }

    return expandedLines.join('\n');
  }

  private createHeroAPI() {
    return {
      moveRight: () => this.move(1, 0, 'right'),
      moveLeft: () => this.move(-1, 0, 'left'),
      moveUp: () => this.move(0, -1, 'up'),
      moveDown: () => this.move(0, 1, 'down'),
      attack: () => this.attack(),
      useSpecial: () => this.useSpecial(),
      usePotion: () => this.usePotion(),
      isEnemyNear: () => this.isEnemyNear(),
      detectEnemy: (type: string) => this.detectEnemy(type),
      observePattern: () => this.observePattern(),
      dodge: (direction: string) => this.dodge(direction),
      findPath: (x: number, y: number) => this.findPath(x, y),
      checkForDeath: () => this.checkForDeath(),
      distanceTo: (target: any) => this.distanceTo(target),
      say: (message: string) => this.say(message),
      get health() { return this.gameState.character.health; },
      get food() { return this.gameState.food; },
      get gems() { return this.gameState.character.gems; },
      get hasKey() { return this.gameState.character.hasKey; },
      get position() { return { ...this.gameState.character.position }; },
      get class() { return this.gameState.character.class; }
    };
  }

  private move(dx: number, dy: number, direction: string): void {
    const newX = this.gameState.character.position.x + dx;
    const newY = this.gameState.character.position.y + dy;
    
    // Check bounds
    if (newX < 0 || newY < 0) {
      this.addLog(`🚫 Cannot move ${direction} - outside the grid!`);
      return;
    }
    
    // Check for walls
    const isWall = this.gameState.obstacles.some(
      obs => obs.position.x === newX && obs.position.y === newY && obs.type === 'wall'
    );
    
    if (isWall) {
      this.addLog(`🧱 Cannot move ${direction} - wall blocking!`);
      return;
    }
    
    // Update position
    this.gameState.character.position = { x: newX, y: newY };
    this.gameState.moves++;
    
    this.addLog(`🚶 Moved ${direction} to (${newX}, ${newY})`);
    
    // Check for collectibles
    this.checkCollectibles(newX, newY);
    
    // Check for obstacles (damage)
    this.checkObstacles(newX, newY);
    
    // Update direction
    this.gameState.character.direction = direction as any;
    
    // Check for enemies at the new position (Gauntlet-style collision damage)
    this.checkEnemyCollision(newX, newY);
  }

  private attack(): void {
    const nearbyEnemies = this.getNearbyEnemies();
    
    if (nearbyEnemies.length === 0) {
      this.addLog('⚔️ No enemies nearby to attack!');
      return;
    }
    
    const enemy = nearbyEnemies[0];
    
    // Check if enemy is Death (cannot be defeated in Gauntlet)
    if (enemy.type === 'death') {
      this.addLog('💀 Death cannot be defeated! Only avoided!');
      // Death still damages the player
      this.gameState.character.health -= enemy.damage;
      this.addLog(`💥 Death drains ${enemy.damage} health!`);
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated by Death!');
        this.gameState.gameOver = true;
      }
      return;
    }
    
    // Check for nearby generators
    const nearbyGenerator = this.generators.find(gen => 
      Math.abs(gen.position.x - this.gameState.character.position.x) <= 1 && 
      Math.abs(gen.position.y - this.gameState.character.position.y) <= 1 &&
      gen.isActive
    );
    
    if (nearbyGenerator) {
      // Attack generator
      nearbyGenerator.health -= 25; // Generators take more damage
      this.addLog(`⚔️ Attacked generator for 25 damage!`);
      
      if (nearbyGenerator.health <= 0) {
        nearbyGenerator.isActive = false;
        this.addLog(`💥 Destroyed the ${nearbyGenerator.type} generator!`);
        this.gameState.score += 100; // Bonus for destroying generator
        
        // Remove generator from obstacles
        const genIndex = this.gameState.obstacles.findIndex(
          obs => obs.position.x === nearbyGenerator.position.x && 
                 obs.position.y === nearbyGenerator.position.y &&
                 obs.type === 'generator'
        );
        
        if (genIndex !== -1) {
          this.gameState.obstacles.splice(genIndex, 1);
        }
      }
      return;
    }
    
    // Normal enemy attack
    const damage = this.calculateDamage();
    enemy.health -= damage;
    
    this.addLog(`⚔️ Attacked ${enemy.type} for ${damage} damage!`);
    
    if (enemy.health <= 0) {
      enemy.isAlive = false;
      this.addLog(`💀 Defeated ${enemy.type}!`);
      this.gameState.score += this.getEnemyValue(enemy.type);
    } else {
      // Enemy attacks back (Gauntlet style)
      this.gameState.character.health -= enemy.damage;
      this.addLog(`💥 ${enemy.type} attacks back for ${enemy.damage} damage!`);
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated!');
        this.gameState.gameOver = true;
      }
    }
  }

  private calculateDamage(): number {
    // Base damage depends on character class (Gauntlet style)
    let baseDamage = 0;
    switch (this.gameState.character.class) {
      case 'warrior':
        baseDamage = 25;
        break;
      case 'valkyrie':
        baseDamage = 20;
        break;
      case 'wizard':
        baseDamage = 15;
        break;
      case 'elf':
        baseDamage = 18;
        break;
      default:
        baseDamage = 20;
    }
    
    // Check for power-up effects
    if (this.powerUps.some(p => p.isActive && p.type === 'power')) {
      baseDamage *= 2;
      this.addLog('💪 Power-up doubles your attack damage!');
    }
    
    return baseDamage;
  }

  private getEnemyValue(type: string): number {
    // Point values for defeating enemies (Gauntlet style)
    switch (type) {
      case 'grunt': return 50;
      case 'ghost': return 75;
      case 'demon': return 100;
      case 'sorcerer': return 150;
      case 'lobber': return 125;
      case 'dragon': return 500;
      case 'orc': return 60;
      case 'skeleton': return 80;
      default: return 50;
    }
  }

  private useSpecial(): void {
    // Special abilities based on character class (Gauntlet style)
    switch (this.gameState.character.class) {
      case 'warrior':
        this.addLog('💪 Warrior uses Berserker Rage! Double damage for 5 seconds!');
        this.powerUps.push({
          id: `power${Date.now()}`,
          type: 'power',
          duration: 5,
          startTime: Date.now(),
          isActive: true
        });
        break;
      case 'valkyrie':
        this.addLog('🛡️ Valkyrie uses Shield! Damage reduced for 5 seconds!');
        this.powerUps.push({
          id: `invincibility${Date.now()}`,
          type: 'invincibility',
          duration: 5,
          startTime: Date.now(),
          isActive: true
        });
        break;
      case 'wizard':
        // Wizard's fireball - ranged attack
        this.addLog('🔥 Wizard casts Fireball!');
        const enemiesInLine = this.gameState.enemies.filter(enemy => {
          const { x, y } = this.gameState.character.position;
          const dir = this.gameState.character.direction;
          
          if (dir === 'right' && enemy.position.y === y && enemy.position.x > x) return true;
          if (dir === 'left' && enemy.position.y === y && enemy.position.x < x) return true;
          if (dir === 'up' && enemy.position.x === x && enemy.position.y < y) return true;
          if (dir === 'down' && enemy.position.x === x && enemy.position.y > y) return true;
          
          return false;
        });
        
        if (enemiesInLine.length > 0) {
          const target = enemiesInLine[0]; // Hit the first enemy in line
          target.health -= 30; // Fireball does more damage
          this.addLog(`🔥 Fireball hits ${target.type} for 30 damage!`);
          
          if (target.health <= 0) {
            target.isAlive = false;
            this.addLog(`💀 Defeated ${target.type} with fireball!`);
            this.gameState.score += this.getEnemyValue(target.type);
          }
        } else {
          this.addLog('🔥 Fireball missed! No enemies in that direction.');
        }
        break;
      case 'elf':
        // Elf's rapid shot - multiple attacks
        this.addLog('🏹 Elf uses Rapid Shot! Multiple arrows fired!');
        const nearbyEnemies = this.getNearbyEnemies();
        
        if (nearbyEnemies.length > 0) {
          nearbyEnemies.forEach(enemy => {
            enemy.health -= 15; // Each arrow does less damage but hits multiple enemies
            this.addLog(`🏹 Arrow hits ${enemy.type} for 15 damage!`);
            
            if (enemy.health <= 0) {
              enemy.isAlive = false;
              this.addLog(`💀 Defeated ${enemy.type} with arrow!`);
              this.gameState.score += this.getEnemyValue(enemy.type);
            }
          });
        } else {
          this.addLog('🏹 No enemies nearby to hit with arrows!');
        }
        break;
      default:
        this.addLog('❓ No special ability available for this character.');
    }
  }

  private usePotion(): void {
    // Check if player has a potion
    const potionIndex = this.gameState.collectibles.findIndex(
      item => item.type === 'potion' && item.collected
    );
    
    if (potionIndex === -1) {
      this.addLog('🧪 No potion in inventory!');
      return;
    }
    
    // Use the potion
    const potion = this.gameState.collectibles[potionIndex];
    this.gameState.collectibles.splice(potionIndex, 1); // Remove from inventory
    
    // Apply potion effect
    const effect = potion.effect || 'invincibility';
    const duration = potion.duration || 10;
    
    this.powerUps.push({
      id: `${effect}${Date.now()}`,
      type: effect as any,
      duration,
      startTime: Date.now(),
      isActive: true
    });
    
    this.addLog(`🧪 Used ${effect} potion! Effect active for ${duration} seconds.`);
    
    // Update active effects
    this.gameState.activeEffects = this.powerUps
      .filter(p => p.isActive)
      .map(p => p.type);
  }

  private isEnemyNear(): boolean {
    return this.getNearbyEnemies().length > 0;
  }

  private getNearbyEnemies(): Enemy[] {
    const { x, y } = this.gameState.character.position;
    return this.gameState.enemies.filter(enemy => {
      if (!enemy.isAlive) return false;
      const distance = Math.abs(enemy.position.x - x) + Math.abs(enemy.position.y - y);
      return distance <= 1;
    });
  }

  private detectEnemy(type: string): boolean {
    const { x, y } = this.gameState.character.position;
    return this.gameState.enemies.some(enemy => {
      if (!enemy.isAlive) return false;
      if (enemy.type !== type) return false;
      const distance = Math.abs(enemy.position.x - x) + Math.abs(enemy.position.y - y);
      return distance <= 3; // Detect enemies within 3 tiles
    });
  }

  private observePattern(): string {
    // For boss battles - returns a pattern the player can use to plan attacks
    const patterns = ['fire', 'ice', 'lightning', 'teleport'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private dodge(direction: string): void {
    // Quick dodge in a direction
    switch (direction) {
      case 'right':
        this.move(1, 0, 'right');
        break;
      case 'left':
        this.move(-1, 0, 'left');
        break;
      case 'up':
        this.move(0, -1, 'up');
        break;
      case 'down':
        this.move(0, 1, 'down');
        break;
      default:
        this.addLog(`❓ Unknown dodge direction: ${direction}`);
    }
  }

  private findPath(targetX: number, targetY: number): boolean {
    // Simplified pathfinding - in a real implementation, this would use A* or similar
    this.addLog(`🔍 Finding path to (${targetX}, ${targetY})...`);
    
    // For now, just move in the general direction
    const { x, y } = this.gameState.character.position;
    
    if (x < targetX) {
      this.move(1, 0, 'right');
      return true;
    } else if (x > targetX) {
      this.move(-1, 0, 'left');
      return true;
    } else if (y < targetY) {
      this.move(0, 1, 'down');
      return true;
    } else if (y > targetY) {
      this.move(0, -1, 'up');
      return true;
    }
    
    return false;
  }

  private checkForDeath(): boolean {
    // Check if Death enemy is nearby (Gauntlet style)
    const { x, y } = this.gameState.character.position;
    return this.gameState.enemies.some(enemy => {
      if (!enemy.isAlive || enemy.type !== 'death') return false;
      const distance = Math.abs(enemy.position.x - x) + Math.abs(enemy.position.y - y);
      return distance <= 3; // Death is within 3 tiles
    });
  }

  private distanceTo(target: Position): number {
    const { x, y } = this.gameState.character.position;
    return Math.abs(target.x - x) + Math.abs(target.y - y);
  }

  private say(message: string): void {
    this.addLog(`💬 Hero says: "${message}"`);
  }

  private checkCollectibles(x: number, y: number): void {
    const collectible = this.gameState.collectibles.find(
      item => item.position.x === x && item.position.y === y && !item.collected
    );
    
    if (collectible) {
      collectible.collected = true;
      
      switch (collectible.type) {
        case 'gem':
          this.gameState.character.gems += collectible.value;
          this.gameState.score += collectible.value;
          this.addLog(`💎 Collected gem! +${collectible.value} gems`);
          break;
        case 'heart':
          this.gameState.character.health = Math.min(
            this.gameState.character.maxHealth,
            this.gameState.character.health + collectible.value
          );
          this.addLog(`❤️ Collected heart! +${collectible.value} health`);
          break;
        case 'key':
          this.gameState.character.hasKey = true;
          this.gameState.keys += 1;
          this.addLog('🗝️ Collected key! You can now exit.');
          break;
        case 'coin':
          this.gameState.score += collectible.value;
          this.addLog(`🪙 Collected coin! +${collectible.value} points`);
          break;
        case 'food':
          // Gauntlet style food restores food meter
          this.gameState.food = Math.min(
            this.gameState.maxFood,
            this.gameState.food + collectible.value
          );
          this.addLog(`🍗 Collected food! +${collectible.value} food`);
          this.playVoiceLine('Food is good!');
          break;
        case 'potion':
          this.gameState.potions += 1;
          this.addLog(`🧪 Collected ${collectible.effect} potion!`);
          break;
        case 'treasure':
          this.gameState.score += collectible.value;
          this.addLog(`💰 Collected treasure! +${collectible.value} points`);
          break;
      }
    }
  }

  private checkObstacles(x: number, y: number): void {
    const obstacle = this.gameState.obstacles.find(
      obs => obs.position.x === x && obs.position.y === y && obs.type !== 'wall' && obs.type !== 'generator'
    );
    
    if (obstacle && obstacle.damage) {
      // Check for invincibility power-up
      if (this.powerUps.some(p => p.isActive && p.type === 'invincibility')) {
        this.addLog(`🛡️ Invincibility protected you from the ${obstacle.type}!`);
        return;
      }
      
      this.gameState.character.health -= obstacle.damage;
      this.addLog(`💥 Hit ${obstacle.type}! Lost ${obstacle.damage} health.`);
      
      // Special handling for 'it' obstacle (Gauntlet II feature)
      if (obstacle.type === 'it') {
        this.addLog(`🎯 You've been tagged as 'It'! All enemies will target you!`);
        // In a full implementation, this would change enemy behavior
      }
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated by the environment!');
        this.gameState.gameOver = true;
      }
    }
  }

  private checkEnemyCollision(x: number, y: number): void {
    const enemy = this.gameState.enemies.find(
      e => e.position.x === x && e.position.y === y && e.isAlive
    );
    
    if (enemy) {
      // Check for invincibility power-up
      if (this.powerUps.some(p => p.isActive && p.type === 'invincibility')) {
        this.addLog(`🛡️ Invincibility protected you from the ${enemy.type}!`);
        return;
      }
      
      this.gameState.character.health -= enemy.damage;
      this.addLog(`💥 Collided with ${enemy.type}! Lost ${enemy.damage} health.`);
      
      if (this.gameState.character.health <= 0) {
        this.addLog('💀 You have been defeated!');
        this.gameState.gameOver = true;
      }
    }
  }

  private checkWinCondition(): boolean {
    const { x, y } = this.gameState.character.position;
    const { exit } = this.gameState;
    
    if (x === exit.x && y === exit.y) {
      if (this.gameState.character.hasKey || !this.hasKeyRequirement()) {
        return true;
      } else {
        this.addLog('🚪 You need a key to exit!');
        this.playVoiceLine('Key is required!');
        return false;
      }
    }
    
    return false;
  }

  private hasKeyRequirement(): boolean {
    return this.gameState.collectibles.some(item => item.type === 'key');
  }

  private playVoiceLine(trigger: string): void {
    // Find a matching voice line that hasn't been played
    const line = this.voiceLines.find(l => !l.played && l.text.includes(trigger));
    if (line) {
      this.addLog(`🔊 "${line.text}"`);
      line.played = true;
    }
  }

  private addLog(message: string): void {
    this.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
}