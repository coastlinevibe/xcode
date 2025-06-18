// 🎮 X-Code Crew Academy: Complete 160 Lesson Story Arc
// The epic journey from beginner to coding legend!

export interface LessonStory {
  lessonId: number;
  title: string;
  storyIntro: string;
  challenge: string;
  mentorQuote: string;
  storyOutro: string;
  nextLessonTeaser?: string;
}

// 🧙‍♂️ CS1: THE AWAKENING SAGA (Lessons 1-40) - Sage the Wizard
export const CS1_STORY: LessonStory[] = [
  // Week 1: The Hero's Awakening (Lessons 1-8)
  {
    lessonId: 1,
    title: "The Hero Awakens",
    storyIntro: "Deep in the mystical Code Academy, a new hero stirs to life. You find yourself in a glowing chamber with Sage the Wizard standing before you, his robes shimmering with digital magic.",
    challenge: "Sage gestures toward a simple corridor. 'Every great coder begins with a single step,' he says with a knowing smile. 'Show me you can move forward, young one.'",
    mentorQuote: "🧙‍♂️ Sage: 'The journey of a thousand programs begins with a single command. Move with purpose!'",
    storyOutro: "As you take your first steps, the ancient stones beneath your feet glow with approval. Sage nods approvingly - you've taken your first step into the world of code!",
    nextLessonTeaser: "Sage's eyes twinkle: 'Now that you can move forward, let me teach you about the four sacred directions...'"
  },
  {
    lessonId: 2,
    title: "The Four Sacred Directions",
    storyIntro: "Sage leads you to a chamber with four glowing portals. 'In the ancient art of coding,' he explains, 'movement is the foundation of all adventures. North, South, East, West - each direction holds power.'",
    challenge: "The chamber's walls shift, creating a maze-like pattern. 'Navigate through this trial using all four directions. Only then will you prove your mastery of movement.'",
    mentorQuote: "🧙‍♂️ Sage: 'A wise coder knows that sometimes the longest path is the safest path. Think before you move!'",
    storyOutro: "The portals pulse with energy as you complete the trial. 'Excellent!' Sage exclaims. 'You understand that coding is about choosing the right direction at the right time.'",
    nextLessonTeaser: "Sage points to glittering objects ahead: 'Now, let me show you the treasures that await those who explore...'"
  },
  {
    lessonId: 3,
    title: "The Treasure Hunter's Trial",
    storyIntro: "You enter a chamber filled with floating gems that pulse with magical energy. Sage explains, 'These are Code Gems - they represent the knowledge you'll gather on your journey.'",
    challenge: "The gems are scattered across a treacherous path. 'Collect them all, young hero. Each gem will make you stronger and wiser in the ways of code.'",
    mentorQuote: "🧙‍♂️ Sage: 'True wealth comes not from gold, but from the knowledge we gather along our path!'",
    storyOutro: "As the last gem touches your hand, it dissolves into pure knowledge, flowing into your mind. You feel your coding power growing stronger!",
    nextLessonTeaser: "Sage chuckles: 'Walking one step at a time is noble, but what if I told you there's a way to move with the speed of thought?'"
  },
  {
    lessonId: 4,
    title: "The Speed of Thought",
    storyIntro: "Sage raises his staff, and mystical numbers appear in the air around you. 'Behold the power of repetition! Why cast one spell when you can cast three with a single command?'",
    challenge: "A long corridor stretches before you, much longer than before. 'Use the ancient bracket notation to move with efficiency. Think like a wizard - work smarter, not harder!'",
    mentorQuote: "🧙‍♂️ Sage: 'The wise wizard casts one spell that does the work of many. This is the first secret of true power!'",
    storyOutro: "You zip across the chamber with newfound speed! Sage beams with pride. 'Now you begin to understand the elegance of efficient code!'",
    nextLessonTeaser: "Sage's expression grows serious: 'Speed is good, but memory is better. Let me teach you to store your thoughts...'"
  },
  {
    lessonId: 5,
    title: "The Memory Crystals",
    storyIntro: "Sage leads you to a wall covered in glowing crystals. 'These are Memory Crystals - they can store any thought, any number, any plan. In coding, we call them variables.'",
    challenge: "The chamber presents a complex puzzle that changes each time you look at it. 'Store your plans in the crystals, then use them to navigate this ever-changing maze.'",
    mentorQuote: "🧙‍♂️ Sage: 'A mind that remembers is powerful, but a mind that can store and recall at will is unstoppable!'",
    storyOutro: "As you successfully use the Memory Crystals, they resonate with your thoughts. You've learned to extend your mind beyond its natural limits!",
    nextLessonTeaser: "Sage touches his temple: 'Memory is good, but awareness is better. Let me teach you to sense your surroundings...'"
  },
  {
    lessonId: 6,
    title: "The Awareness Awakening",
    storyIntro: "Sage closes his eyes and seems to sense everything around him. 'A true coder must be aware - of their health, their resources, their situation. This is the gift of perception.'",
    challenge: "The chamber dims, and you must navigate using only your inner awareness. 'Feel your health, count your gems, sense your status. Let awareness guide you.'",
    mentorQuote: "🧙‍♂️ Sage: 'Those who know themselves and their situation can make wise decisions. Ignorance leads to failure!'",
    storyOutro: "Your perception sharpens like a blade. You can now sense things about yourself that were hidden before. True awareness has awakened!",
    nextLessonTeaser: "Sage nods approvingly: 'Awareness leads to wisdom, and wisdom leads to choice. Let me teach you the power of decisions...'"
  },
  {
    lessonId: 7,
    title: "The Crossroads of Choice",
    storyIntro: "You arrive at a mystical crossroads where paths split in multiple directions. Sage gestures to glowing runes above each path. 'Life is full of choices, young hero. In coding, we make these choices with 'if' statements.'",
    challenge: "Each path leads to different outcomes based on your current state. 'Choose wisely using the ancient 'if' magic. Let your condition determine your path.'",
    mentorQuote: "🧙‍♂️ Sage: 'The power to choose based on wisdom rather than impulse - this separates the master from the apprentice!'",
    storyOutro: "You navigate the crossroads with newfound wisdom, making choices based on logic rather than chance. The power of decision-making flows through you!",
    nextLessonTeaser: "Sage's eyes gleam with pride: 'You've learned the basics well. Now let me see if you can combine them all in your first real challenge...'"
  },
  {
    lessonId: 8,
    title: "The First Trial of Mastery",
    storyIntro: "Sage leads you to an ornate chamber with a complex puzzle that seems to shift and change. 'This is your first Trial of Mastery. It will test everything you've learned so far.'",
    challenge: "The chamber contains movement challenges, memory tests, awareness puzzles, and decision points all combined into one epic trial. 'Show me that you can weave all your skills together like a true coder!'",
    mentorQuote: "🧙‍♂️ Sage: 'Individual skills are like single notes. True mastery comes from playing them together in harmony!'",
    storyOutro: "As you complete the trial, the chamber erupts in magical light! Sage applauds. 'Magnificent! You're ready to meet your fellow mentors. But first, let me warn you of the dangers ahead...'",
    nextLessonTeaser: "Sage's expression grows serious: 'The path ahead holds dangers. You must learn to face obstacles and hazards...'"
  },

  // Week 2: The Dangers Emerge (Lessons 9-16)
  {
    lessonId: 9,
    title: "The Gauntlet of Hazards",
    storyIntro: "Sage leads you into a chamber filled with ominous spikes, flickering flames, and poisonous pools. 'Not all paths are safe, young hero. A wise coder learns to identify and avoid danger.'",
    challenge: "Navigate through the hazardous chamber without taking damage. 'Study each obstacle, plan your route, and remember - sometimes the longer path is the safer path.'",
    mentorQuote: "🧙‍♂️ Sage: 'Courage is not the absence of fear, but the wisdom to avoid unnecessary risks!'",
    storyOutro: "You emerge unscathed from the gauntlet! Sage nods with approval. 'Excellent! You understand that survival often depends on careful planning.'",
    nextLessonTeaser: "A mighty roar echoes through the halls. Sage smiles: 'Ah, that would be Rex. Come, let me introduce you to your second mentor...'"
  },
  {
    lessonId: 10,
    title: "The Warrior's Arrival",
    storyIntro: "The chamber doors burst open with a thunderous crash! Rex the Warrior strides in, his armor gleaming and his sword at his side. 'So this is our new recruit!' he booms with a hearty laugh.",
    challenge: "Rex demonstrates his strength by moving massive stone blocks with ease. 'Strength comes from repetition, young one! Show me you understand the warrior's way!'",
    mentorQuote: "⚔️ Rex: 'A warrior's strength is built through countless repetitions. Every swing of the sword, every step forward - practice makes perfect!'",
    storyOutro: "Rex claps you on the shoulder with surprising gentleness. 'Good! You have the heart of a warrior. But first, you must learn to fight!'",
    nextLessonTeaser: "Rex grins and draws his sword: 'Sage taught you to think. Now I'll teach you to fight! Prepare for combat training!'"
  },
  {
    lessonId: 11,
    title: "First Blood - Combat Training",
    storyIntro: "Rex leads you to a training arena where practice dummies shaped like orcs await. 'Every coder must learn to fight their bugs and errors! Combat teaches precision and timing.'",
    challenge: "Face your first real enemy in combat. 'Attack with purpose! Each strike must count. Learn the rhythm of battle!'",
    mentorQuote: "⚔️ Rex: 'In battle, hesitation means defeat. Strike with confidence and keep striking until victory is yours!'",
    storyOutro: "Your first enemy falls! Rex cheers loudly. 'Ha! You have the spirit of a warrior! But one enemy is just the beginning...'",
    nextLessonTeaser: "Rex's expression grows more serious: 'Single combat is one thing, but what happens when enemies keep coming? Let me teach you about persistence...'"
  },
  {
    lessonId: 12,
    title: "The Endless Battle",
    storyIntro: "Rex brings you to a chamber where enemies seem to spawn endlessly from dark portals. 'Sometimes, young warrior, you don't know how many foes you'll face. This is where loops become your greatest weapon!'",
    challenge: "Fight waves of enemies using while loops. 'Keep fighting while enemies remain! Let your code be as relentless as a warrior's spirit!'",
    mentorQuote: "⚔️ Rex: 'A true warrior fights not until tired, but until the battle is won! While there are enemies, we fight!'",
    storyOutro: "The last enemy falls, and the portals close! Rex pounds his chest with pride. 'Now you understand the warrior's persistence!'",
    nextLessonTeaser: "Rex gestures to scattered treasures: 'Victory brings rewards, but a smart warrior collects them efficiently...'"
  },
  {
    lessonId: 13,
    title: "The Treasure Sweep",
    storyIntro: "The battlefield is littered with gems and treasures from your victories. Rex surveys the scene with satisfaction. 'After every battle comes the harvest. A warrior collects rewards efficiently!'",
    challenge: "Use loops to systematically collect all treasures from the battlefield. 'Don't leave a single gem behind! Efficiency in collection is as important as efficiency in battle!'",
    mentorQuote: "⚔️ Rex: 'Victory without reward is hollow. Collect your prizes with the same determination you showed in battle!'",
    storyOutro: "Your systematic collection impresses Rex greatly. 'Excellent! You fight like a warrior and think like a strategist!'",
    nextLessonTeaser: "Rex points to a locked door: 'Some battles require more than strength. Sometimes you need the right key at the right time...'"
  },
  {
    lessonId: 14,
    title: "The Quest for the Sacred Key",
    storyIntro: "Before you stands an ancient door sealed with powerful magic. Rex examines the lock carefully. 'Some obstacles can't be smashed through, warrior. Sometimes you need finesse and the right tools.'",
    challenge: "Navigate the chamber to find the key, then return to unlock the exit. 'A true warrior knows when to fight and when to seek another solution!'",
    mentorQuote: "⚔️ Rex: 'Strength is knowing when to use your sword and when to use your brain. Both are weapons of a true warrior!'",
    storyOutro: "The ancient door swings open with a satisfying click! Rex nods approvingly. 'You're learning that being a warrior is about more than just fighting!'",
    nextLessonTeaser: "A graceful figure appears in the doorway. Rex bows respectfully: 'Ah, Arrow approaches. Time to meet your third mentor...'"
  },
  {
    lessonId: 15,
    title: "The Archer's Precision",
    storyIntro: "Arrow the Elf glides into the chamber with fluid grace, her bow gleaming in the magical light. 'Greetings, young student. I am Arrow, and I teach the art of precision and logical thinking.'",
    challenge: "Arrow sets up a complex target practice. 'Precision comes from careful planning and logical thinking. Show me you can think before you act!'",
    mentorQuote: "🏹 Arrow: 'An arrow shot without aim will miss every time. Think, plan, then execute with precision!'",
    storyOutro: "Your careful approach impresses Arrow greatly. 'Excellent! You understand that true skill comes from the mind, not just the body.'",
    nextLessonTeaser: "Arrow's eyes gleam with intelligence: 'Sage taught you basics, Rex taught you strength. Now I'll teach you to think strategically...'"
  },
  {
    lessonId: 16,
    title: "The Strategic Mind",
    storyIntro: "Arrow leads you to a chamber that changes based on your actions. 'A true strategist adapts to changing conditions. Your code must be smart enough to make different choices in different situations.'",
    challenge: "Navigate a dynamic environment that requires different strategies based on your current state. 'Let your conditions guide your actions. Think like a chess master!'",
    mentorQuote: "🏹 Arrow: 'The wise archer changes their aim based on the wind. Adapt your strategy to your situation!'",
    storyOutro: "You successfully adapt to every challenge the chamber presents! Arrow smiles with satisfaction. 'Now you begin to think like a true strategist!'",
    nextLessonTeaser: "Arrow's expression grows serious: 'Strategy is good, but when facing multiple enemies, you need advanced tactics...'"
  },

  // Week 3: The Advanced Trials (Lessons 17-24)
  {
    lessonId: 17,
    title: "The Multi-Front War",
    storyIntro: "You enter a vast arena where enemies attack from multiple directions simultaneously. All three mentors watch from above. 'This is where all your training comes together,' Arrow calls down. 'Multiple threats require multiple strategies!'",
    challenge: "Face several enemies positioned strategically around the arena. 'Use everything you've learned - movement, combat, strategy, and timing!'",
    mentorQuote: "🏹 Arrow: 'In chaos, the prepared mind finds order. Plan your battles, fight your plan!'",
    storyOutro: "You emerge victorious from the chaotic battle! All three mentors cheer. Your strategic thinking has reached a new level!",
    nextLessonTeaser: "Sage calls down: 'Victory is sweet, but a wise hero manages their resources. Let me teach you about health management...'"
  },
  {
    lessonId: 18,
    title: "The Healer's Wisdom",
    storyIntro: "Sage descends to the arena, carrying glowing health potions. 'A hero who ignores their health is a hero who won't live to see victory. Resource management is crucial for long-term success.'",
    challenge: "Navigate a dangerous area while carefully managing your health and collecting healing items when needed. 'Know when to fight, when to heal, and when to retreat!'",
    mentorQuote: "🧙‍♂️ Sage: 'The bravest warrior is useless if they fall in the first battle. Wisdom means knowing your limits!'",
    storyOutro: "You successfully balance aggression with caution, emerging healthy and victorious! Sage nods with deep approval.",
    nextLessonTeaser: "Arrow reappears: 'Simple decisions are easy. But what happens when you need to make decisions within decisions?'"
  },
  {
    lessonId: 19,
    title: "The Labyrinth of Choices",
    storyIntro: "Arrow leads you into a complex labyrinth where each path branches into more paths. 'Life rarely offers simple choices. Often, one decision leads to another, then another. This is the power of nested thinking.'",
    challenge: "Navigate a maze where each decision point requires multiple levels of logical thinking. 'Think in layers - if this, then check that, then decide the other!'",
    mentorQuote: "🏹 Arrow: 'A master archer considers the wind, the distance, the target's movement, and more - all in a single moment!'",
    storyOutro: "You successfully navigate the complex decision tree! Arrow applauds. 'Now you think in multiple dimensions - a true sign of mastery!'",
    nextLessonTeaser: "Rex appears with a grin: 'Thinking is good, but what if you could package that thinking and use it again and again?'"
  },
  {
    lessonId: 20,
    title: "The Warrior's Techniques",
    storyIntro: "Rex demonstrates a complex sword technique, breaking it down into smaller, repeatable moves. 'Every master has signature techniques - combinations of moves that work together. In coding, we call these functions!'",
    challenge: "Create your first function to solve a complex challenge. 'Package your best strategies into reusable techniques!'",
    mentorQuote: "⚔️ Rex: 'A warrior who masters one technique and uses it perfectly will defeat a warrior who knows a hundred techniques poorly!'",
    storyOutro: "Your first function works flawlessly! Rex beams with pride. 'Now you're thinking like a true code warrior - efficient and reusable!'",
    nextLessonTeaser: "Rex's eyes light up: 'Good techniques are powerful, but flexible techniques are unstoppable. Let me show you...'"
  },
  {
    lessonId: 21,
    title: "The Flexible Warrior",
    storyIntro: "Rex shows you how the same sword technique can be modified for different opponents. 'A rigid technique breaks under pressure, but a flexible technique adapts to any situation. This is the power of parameters!'",
    challenge: "Create functions that can adapt to different situations by accepting different inputs. 'Make your techniques as flexible as a master warrior's blade!'",
    mentorQuote: "⚔️ Rex: 'The same strike can be gentle or powerful, quick or slow, depending on what the situation demands!'",
    storyOutro: "Your flexible functions handle every challenge thrown at them! Rex nods with deep respect. 'Now you truly fight like a master!'",
    nextLessonTeaser: "Arrow steps forward: 'Flexibility is excellent, but what about precision? Let me show you the archer's way of exact repetition...'"
  },
  {
    lessonId: 22,
    title: "The Archer's Count",
    storyIntro: "Arrow sets up exactly 10 targets in a perfect line. 'Sometimes you know exactly how many shots you need to take. The for loop is like drawing your bow a precise number of times.'",
    challenge: "Use for loops to perform exact numbers of actions with perfect precision. 'Count your shots, make each one count!'",
    mentorQuote: "🏹 Arrow: 'An archer who can hit 10 targets with exactly 10 arrows wastes nothing and achieves everything!'",
    storyOutro: "Your precise counting and execution impresses Arrow greatly! 'Perfect! You understand the beauty of exact repetition!'",
    nextLessonTeaser: "Sage appears with a scroll covered in symbols: 'Precision is good, but organization is better. Let me show you how to store multiple pieces of information...'"
  },
  {
    lessonId: 23,
    title: "The Scroll of Many Truths",
    storyIntro: "Sage unrolls a magical scroll that contains multiple pieces of information organized in a list. 'Sometimes one piece of information isn't enough. Arrays let you store and organize multiple related items!'",
    challenge: "Use arrays to manage multiple pieces of information and process them systematically. 'Organize your knowledge like a true scholar!'",
    mentorQuote: "🧙‍♂️ Sage: 'A wise mind organizes information like a library organizes books - everything in its place, everything accessible!'",
    storyOutro: "You masterfully organize and use multiple pieces of information! Sage's eyes twinkle with pride. 'Now you think like a true scholar-warrior!'",
    nextLessonTeaser: "All three mentors gather around you: 'You've learned much, young hero. Time for a trial that tests everything at once...'"
  },
  {
    lessonId: 24,
    title: "The Trial of Three Masters",
    storyIntro: "Sage, Rex, and Arrow stand together, each contributing to a massive, complex challenge. 'This trial requires wisdom, strength, and precision all working together,' they say in unison. 'Show us you can integrate all your skills!'",
    challenge: "Face a complex multi-stage challenge that requires variables, loops, conditions, functions, and arrays all working together. 'Prove you're ready for the advanced teachings!'",
    mentorQuote: "🧙‍♂️⚔️🏹 All Three: 'Individual skills make a student, but integrated skills make a master!'",
    storyOutro: "You successfully complete the trial using all your skills in harmony! The three mentors exchange proud glances. 'Magnificent! You're ready to meet our final mentor...'",
    nextLessonTeaser: "A regal figure appears in golden light: 'I am Luna the Valkyrie, and I will teach you the highest arts of code organization...'"
  },

  // Week 4: The Advanced Arts (Lessons 25-32)
  {
    lessonId: 25,
    title: "The Valkyrie's Arrival",
    storyIntro: "Luna the Valkyrie descends from above in a blaze of golden light, her armor gleaming and her presence commanding respect. 'Greetings, young hero. I am Luna, and I teach the highest art - organization and leadership in code.'",
    challenge: "Luna presents a challenge that requires careful organization and planning. 'Show me you can think not just about individual commands, but about the structure of your entire solution!'",
    mentorQuote: "👑 Luna: 'A true leader organizes not just their own actions, but creates systems that others can follow and understand!'",
    storyOutro: "Your organized approach impresses Luna greatly! 'Excellent! You understand that true mastery comes from clear thinking and clear structure!'",
    nextLessonTeaser: "Luna's eyes gleam with wisdom: 'Organization begins with understanding how to group related information together...'"
  },
  {
    lessonId: 26,
    title: "The Palace of Objects",
    storyIntro: "Luna leads you to an elegant palace where everything is perfectly organized. 'Objects in coding are like rooms in a palace - each contains related items and serves a specific purpose.'",
    challenge: "Learn to create and use objects to organize related information logically. 'Group your data like a master architect groups rooms!'",
    mentorQuote: "👑 Luna: 'A well-organized mind creates well-organized code, and well-organized code creates powerful programs!'",
    storyOutro: "You successfully organize complex information using objects! Luna nods with royal approval. 'Now you begin to think like a true architect of code!'",
    nextLessonTeaser: "Luna gestures to glowing messages in the air: 'Organization is good, but communication is essential. Let me teach you about working with text...'"
  },
  {
    lessonId: 27,
    title: "The Language of Power",
    storyIntro: "Luna shows you how words and messages can be woven together like spells. 'Text and strings are the language of communication in code. Master them, and you can make your programs speak!'",
    challenge: "Use string manipulation to create dynamic messages and communicate effectively. 'Let your code speak with clarity and purpose!'",
    mentorQuote: "👑 Luna: 'The power to communicate clearly is the power to lead effectively. Make your code speak with authority!'",
    storyOutro: "Your mastery of text and communication impresses Luna! 'Excellent! You understand that code is not just logic, but communication!'",
    nextLessonTeaser: "Luna's expression grows serious: 'Communication is powerful, but what happens when things go wrong? Let me teach you about handling errors...'"
  },
  {
    lessonId: 28,
    title: "The Art of Recovery",
    storyIntro: "Luna leads you to a chamber filled with broken mechanisms and failed experiments. 'Even masters make mistakes, young hero. The true art is learning to find and fix those mistakes quickly.'",
    challenge: "Learn to identify, debug, and fix common coding errors. 'A leader takes responsibility for mistakes and fixes them with grace!'",
    mentorQuote: "👑 Luna: 'Perfection is not the absence of mistakes, but the wisdom to find and correct them swiftly!'",
    storyOutro: "You successfully identify and fix multiple errors! Luna smiles with approval. 'Now you understand that mastery includes the humility to learn from mistakes!'",
    nextLessonTeaser: "Rex joins Luna: 'Fixing mistakes is good, but preventing them through superior strategy is better...'"
  },
  {
    lessonId: 29,
    title: "The Supreme Battle Strategy",
    storyIntro: "Rex and Luna work together to present the most complex combat scenario yet. 'This is where warrior strength meets royal strategy,' they explain. 'Advanced combat requires both power and intelligence!'",
    challenge: "Face the most challenging combat scenario using advanced strategies and optimized techniques. 'Fight like a warrior, think like a general!'",
    mentorQuote: "⚔️👑 Rex & Luna: 'True mastery in battle comes from combining raw power with strategic brilliance!'",
    storyOutro: "You emerge victorious from the supreme battle! Rex and Luna exchange impressed glances. 'Now you fight with the skill of a true champion!'",
    nextLessonTeaser: "Luna steps forward: 'Victory is sweet, but efficiency is sweeter. Let me teach you to make your code run like lightning...'"
  },
  {
    lessonId: 30,
    title: "The Lightning Code",
    storyIntro: "Luna demonstrates code that runs with incredible speed and efficiency. 'Fast code is good code, young hero. Learn to make every command count, every loop efficient, every decision swift!'",
    challenge: "Optimize your code for maximum speed and efficiency. 'Make your programs run like lightning across the sky!'",
    mentorQuote: "👑 Luna: 'Elegance in code is not just beauty - it's power. Efficient code is a work of art!'",
    storyOutro: "Your optimized code runs with incredible efficiency! Luna applauds. 'Beautiful! You understand that true mastery includes making things look effortless!'",
    nextLessonTeaser: "All four mentors gather: 'Individual excellence is good, but coordinated excellence is legendary...'"
  },
  {
    lessonId: 31,
    title: "The Grand Coordination",
    storyIntro: "All four mentors stand together, each contributing their expertise to create a massive, coordinated challenge. 'This is where all skills unite,' they declare. 'Show us you can coordinate multiple complex actions like a true leader!'",
    challenge: "Execute a complex, multi-part strategy that requires perfect coordination of all your skills. 'Lead your code like a general leads an army!'",
    mentorQuote: "🧙‍♂️⚔️🏹👑 All Four: 'Individual mastery creates experts, but coordinated mastery creates legends!'",
    storyOutro: "You successfully coordinate every aspect of the complex challenge! All four mentors bow in respect. 'Magnificent! You truly understand the art of coordination!'",
    nextLessonTeaser: "Luna steps forward with a serious expression: 'You've learned much, but the greatest test still awaits. Are you ready for your final preparation?'"
  },
  {
    lessonId: 32,
    title: "The Final Preparation",
    storyIntro: "Luna leads you to a chamber that contains elements from every previous lesson. 'This is your final preparation before the ultimate trials. Review everything, integrate everything, master everything!'",
    challenge: "Face a comprehensive review challenge that tests every skill you've learned. 'Show us that you're ready for the greatest challenges ahead!'",
    mentorQuote: "👑 Luna: 'Preparation is the foundation of victory. Review your skills, sharpen your mind, prepare for greatness!'",
    storyOutro: "You successfully demonstrate mastery of every skill! Luna nods with deep satisfaction. 'Perfect! You're ready for the advanced trials ahead!'",
    nextLessonTeaser: "Luna's eyes gleam with anticipation: 'Now comes the true test of mastery - can you think like a computer scientist?'"
  },

  // Week 5: The Master's Trials (Lessons 33-40)
  {
    lessonId: 33,
    title: "The Mind of the Machine",
    storyIntro: "Luna leads you to a chamber filled with complex mechanical puzzles that seem to think for themselves. 'To truly master code, you must think like the machine itself - in algorithms, in steps, in perfect logic.'",
    challenge: "Solve complex problems by breaking them down into algorithmic steps. 'Think like a computer scientist - systematic, logical, precise!'",
    mentorQuote: "👑 Luna: 'The greatest coders don't just write code - they think in code, dream in algorithms, and solve problems like living computers!'",
    storyOutro: "Your algorithmic thinking impresses Luna beyond words! 'Incredible! You truly think like a master computer scientist!'",
    nextLessonTeaser: "Luna's expression grows excited: 'Algorithmic thinking is powerful, but pattern recognition is the key to true mastery...'"
  },
  {
    lessonId: 34,
    title: "The Pattern Master",
    storyIntro: "The chamber transforms into a kaleidoscope of repeating patterns and designs. Luna gestures to the swirling complexity. 'Patterns are everywhere in code - recognize them, use them, master them!'",
    challenge: "Identify and utilize complex patterns to solve increasingly sophisticated problems. 'See the patterns that others miss, use them to create elegant solutions!'",
    mentorQuote: "👑 Luna: 'A master sees patterns where others see chaos, finds order where others find confusion!'",
    storyOutro: "You identify and master every pattern presented! Luna's eyes shine with pride. 'Magnificent! You see the hidden order in complexity!'",
    nextLessonTeaser: "Luna's voice grows reverent: 'Pattern recognition leads to the ultimate skill - solving problems that seem impossible...'"
  },
  {
    lessonId: 35,
    title: "The Impossible Made Possible",
    storyIntro: "Luna presents you with a challenge that seems impossible at first glance - a massive, complex problem that would overwhelm most heroes. 'This is where true masters prove themselves - by making the impossible possible!'",
    challenge: "Break down and solve an extremely complex problem using all your accumulated skills and wisdom. 'Show the world what a true code master can accomplish!'",
    mentorQuote: "👑 Luna: 'Impossible is just a word used by those who haven't learned to break big problems into small solutions!'",
    storyOutro: "You solve the 'impossible' problem with elegant mastery! Luna bows deeply. 'You have achieved what few ever do - true problem-solving mastery!'",
    nextLessonTeaser: "Luna's expression grows thoughtful: 'Solving problems is one thing, but creating beautiful solutions is the mark of an artist...'"
  },
  {
    lessonId: 36,
    title: "The Code Artist",
    storyIntro: "Luna shows you examples of code so beautiful and elegant they seem like works of art. 'True masters don't just solve problems - they create solutions so beautiful that other coders weep with joy!'",
    challenge: "Create solutions that are not just functional, but beautiful, elegant, and inspiring. 'Make your code a work of art!'",
    mentorQuote: "👑 Luna: 'Anyone can write code that works. Masters write code that sings, that dances, that inspires!'",
    storyOutro: "Your code achieves true artistic beauty! Luna applauds with tears in her eyes. 'Beautiful! You understand that code is not just logic - it's art!'",
    nextLessonTeaser: "Luna's voice grows excited: 'Beautiful code is wonderful, but fast, efficient code changes the world...'"
  },
  {
    lessonId: 37,
    title: "The Speed of Lightning",
    storyIntro: "Luna demonstrates code that runs so fast it seems to bend time itself. 'Performance optimization is the difference between good code and legendary code. Make your programs run like lightning!'",
    challenge: "Optimize complex code to run with maximum speed and efficiency. 'Make every microsecond count, every operation perfect!'",
    mentorQuote: "👑 Luna: 'Fast code isn't just convenient - it's respectful. Respect your users' time by making your code lightning-fast!'",
    storyOutro: "Your optimized code runs with incredible speed! Luna nods with deep respect. 'Perfect! You understand that efficiency is a form of respect!'",
    nextLessonTeaser: "Luna's eyes gleam with anticipation: 'You've mastered the fundamentals. Now let me show you what awaits in the Great Gauntlet...'"
  },
  {
    lessonId: 38,
    title: "The Gauntlet Beckons",
    storyIntro: "Luna leads you to a massive portal that pulses with adventure and challenge. Beyond it, you can see glimpses of the Great Gauntlet - 100 levels of epic coding adventure waiting for you!",
    challenge: "Complete a preview challenge that demonstrates the type of adventures waiting in the Gauntlet. 'This is just a taste of the epic journey ahead!'",
    mentorQuote: "👑 Luna: 'The Gauntlet is where learning becomes adventure, where skills become legends, where heroes become immortal!'",
    storyOutro: "You successfully complete the Gauntlet preview! Luna's eyes shine with excitement. 'The Great Gauntlet awaits your mastery!'",
    nextLessonTeaser: "Luna's expression grows serious: 'But first, one final test to prove you're truly ready for the ultimate challenges...'"
  },
  {
    lessonId: 39,
    title: "The Ultimate Trial",
    storyIntro: "All four mentors stand together before the most complex challenge ever created. 'This is it, young hero,' they say in unison. 'The Ultimate Trial that will prove you're ready to graduate from student to master!'",
    challenge: "Face the most comprehensive and challenging test that requires mastery of every skill, every concept, every technique you've learned. 'Show us - and yourself - that you are truly ready!'",
    mentorQuote: "🧙‍♂️⚔️🏹👑 All Four: 'This trial will test not just your skills, but your heart, your mind, and your spirit. Show us your true mastery!'",
    storyOutro: "You complete the Ultimate Trial with magnificent mastery! All four mentors cheer and applaud. 'Incredible! You are truly ready for graduation!'",
    nextLessonTeaser: "The mentors exchange proud glances: 'Tomorrow, you graduate. Tonight, we celebrate your incredible journey...'"
  },
  {
    lessonId: 40,
    title: "The Grand Graduation",
    storyIntro: "The Academy transforms into a magnificent celebration hall. All four mentors stand proudly as magical lights dance around you. 'Today, you graduate from student to master,' they announce. 'Today, you become a true Code Hero!'",
    challenge: "Complete a ceremonial final challenge that celebrates everything you've learned and achieved. 'This is not a test - this is a celebration of your mastery!'",
    mentorQuote: "🧙‍♂️⚔️🏹👑 All Four: 'You came to us as a beginner, but you leave as a master. The Great Gauntlet awaits, and we know you will conquer it!'",
    storyOutro: "Confetti falls from the sky as you complete your graduation ceremony! The Great Gauntlet portal opens wide, and adventure beckons. You are now a true Code Hero, ready for any challenge!",
    nextLessonTeaser: "The Great Gauntlet awaits! 100 levels of epic adventure, treasure, and glory! Your legend begins now!"
  }
];

// 🎯 STORY THEMES BY WEEK
export const STORY_THEMES = {
  week1: "The Hero's Awakening - Discovery of basic powers and abilities",
  week2: "The Dangers Emerge - Learning to face challenges and meet mentors", 
  week3: "The Advanced Trials - Mastering complex skills and integration",
  week4: "The Advanced Arts - Learning organization, optimization, and leadership",
  week5: "The Master's Trials - Achieving true mastery and preparing for adventure"
};

// 🎮 GAUNTLET STORY INTEGRATION
export const GAUNTLET_STORY_INTRO = {
  title: "The Great Gauntlet Awaits!",
  description: "With your training complete, the legendary Great Gauntlet opens before you - 100 levels of epic coding adventure where you'll use all your skills to become a true legend!",
  mentorSendOff: "Your mentors watch proudly as you step through the portal. 'Remember everything we taught you,' they call out. 'And most importantly - have fun becoming a legend!'"
};

// 🏆 STORY PROGRESSION REWARDS
export const STORY_REWARDS = {
  weekCompletion: "Special story cutscenes and mentor interactions",
  mentorUnlocks: "New mentors join your journey with unique personalities",
  skillMilestones: "Epic story moments celebrating your growing mastery",
  graduation: "Grand ceremony and Gauntlet unlock with full fanfare"
};