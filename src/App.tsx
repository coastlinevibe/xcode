import React, { useState, useCallback, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { GameGrid } from './components/GameGrid';
import { CodeEditor } from './components/CodeEditor';
import { GameStats } from './components/GameStats';
import { ExecutionLog } from './components/ExecutionLog';
import { SpriteManager } from './components/SpriteManager';
import { CrewIntroduction } from './components/CrewIntroduction';
import { LessonPlanViewer } from './components/LessonPlanViewer';
import { CharacterCreator } from './components/CharacterCreator';
import { AudioManager } from './components/AudioManager';
import { AssetManager } from './components/AssetManager';
import { ProjectManager } from './components/ProjectManager';
import { LEVELS } from './data/levels';
import { XCODE_CREW, CrewMember } from './data/story';
import { LESSON_PLAN, Lesson } from './data/lessonPlan';
import { GameState, SpriteAnimation } from './types/game';
import { CodeExecutor } from './utils/codeExecutor';
import { loadCharacterAnimations } from './utils/loadCharacterAnimations';
import { AnimationEditor } from './components/AnimationEditor';
import { SpriteLibrary } from './components/SpriteLibrary';
import { CharacterAnimator } from './components/CharacterAnimator';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [code, setCode] = useState(LEVELS[0].starterCode);
  const [gameState, setGameState] = useState<GameState>({
    x: 5,
    y: 5,
    direction: 'down',
    isRunning: false,
    gameOver: false,
    moves: 0,
    diamonds: 0,
    keys: 0,
    character: {
      class: 'warrior',
      position: { x: 5, y: 5 },
      direction: 'down'
    }
  });
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [currentExecutingLine, setCurrentExecutingLine] = useState<number | undefined>();
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [currentAction, setCurrentAction] = useState<'idle' | 'walking' | 'attacking' | 'dead'>('idle');
  const [currentProgress, setCurrentProgress] = useState(1);
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);
  const [showCrewIntro, setShowCrewIntro] = useState(false);
  const [showLessonPlan, setShowLessonPlan] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [spriteName, setSpriteName] = useState('');
  const [animations, setAnimations] = useState<any[]>([]);
  const [sprites, setSprites] = useState<Record<string, SpriteAnimation>>({});

  const currentLevel = LEVELS[currentLevelIndex];

  // Dynamically load the correct animation set for the current hero
  const heroClass = gameState.character?.class || 'warrior';
  const heroSprites = loadCharacterAnimations(heroClass);

  const resetLevel = useCallback(() => {
    const level = LEVELS[currentLevelIndex];
    setGameState({
      currentLevel: currentLevelIndex + 1,
      character: { ...level.character },
      enemies: level.enemies.map(e => ({ ...e })),
      collectibles: level.collectibles.map(c => ({ ...c })),
      obstacles: level.obstacles,
      exit: level.exit,
      isRunning: false,
      isComplete: false,
      gameOver: false,
      moves: 0,
      executionLog: [],
      score: gameState.score
    });
    setExecutionLogs([]);
    setCode(level.starterCode);
    setShowHint(false);
    setShowSolution(false);
    setCurrentExecutingLine(-1);
    setCodeLines([]);
    setCurrentAction('idle');
  }, [currentLevelIndex, gameState.score]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < LEVELS.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      const nextLevel = LEVELS[nextIndex];
      
      setCurrentLevelIndex(nextIndex);
      setCurrentProgress(prev => prev + 1);
      setCode(nextLevel.starterCode);
      setGameState({
        currentLevel: nextIndex + 1,
        character: { ...nextLevel.character },
        enemies: nextLevel.enemies.map(e => ({ ...e })),
        collectibles: nextLevel.collectibles.map(c => ({ ...c })),
        obstacles: nextLevel.obstacles,
        exit: nextLevel.exit,
        isRunning: false,
        isComplete: false,
        gameOver: false,
        moves: 0,
        executionLog: [],
        score: gameState.score
      });
      setExecutionLogs([]);
      setShowHint(false);
      setShowSolution(false);
      setCurrentExecutingLine(-1);
      setCodeLines([]);
      setCurrentAction('idle');
    }
  }, [currentLevelIndex, gameState.score]);

  const runCode = useCallback(async () => {
    if (gameState.isRunning) return;

    setGameState(prev => ({ ...prev, isRunning: true }));
    setCurrentAction('walking');
    
    const executor = new CodeExecutor(gameState);
    
    await executor.executeCode(code, (newState, logs, currentLine, codeLines) => {
      setGameState(newState);
      setExecutionLogs(logs);
      if (currentLine !== undefined) setCurrentExecutingLine(currentLine);
      if (codeLines) setCodeLines(codeLines);
      
      if (newState.gameOver) {
        setCurrentAction('dead');
      } else if (newState.isRunning) {
        setCurrentAction('walking');
      } else {
        setCurrentAction('idle');
      }
    });
    
    setCurrentAction('idle');
  }, [code, gameState]);

  const handleShowHint = useCallback(() => {
    setShowHint(true);
  }, []);

  const handleShowSolution = useCallback(() => {
    if (currentLevel.solution) {
      setCode(currentLevel.solution);
      setShowSolution(true);
    }
  }, [currentLevel.solution]);

  const handleSpritesUpdate = useCallback((newSprites: Record<string, SpriteAnimation>) => {
    console.log('🎯 App received Construct 3 animations:', Object.keys(newSprites));
    setSprites(newSprites);
  }, []);

  const handleCrewMemberSelect = useCallback((member: CrewMember) => {
    setSelectedCrewMember(member);
    setShowCrewIntro(false);
  }, []);

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setCurrentProgress(lesson.id);
    setShowLessonPlan(false);
  }, []);

  // Keyboard movement for hero (pixel-based)
  useEffect(() => {
    let walkTimeout: NodeJS.Timeout | null = null;
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState(prev => {
        let { x, y, direction } = prev;
        let moved = false;
        const step = 8; // pixels per move

        if (e.key === 'ArrowUp') {
          y -= step;
          direction = 'up';
          moved = true;
        } else if (e.key === 'ArrowDown') {
          y += step;
          direction = 'down';
          moved = true;
        } else if (e.key === 'ArrowLeft') {
          x -= step;
          direction = 'left';
          moved = true;
        } else if (e.key === 'ArrowRight') {
          x += step;
          direction = 'right';
          moved = true;
        }

        if (!moved) return prev;

        // Update both the top-level position and the character's position
        return {
          ...prev,
          x,
          y,
          direction,
          character: {
            ...prev.character,
            position: { x, y },
            direction
          }
        };
      });

      if (walkTimeout) {
        clearTimeout(walkTimeout);
      }
      setCurrentAction('walking');
      walkTimeout = setTimeout(() => {
        setCurrentAction('idle');
      }, 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (walkTimeout) {
        clearTimeout(walkTimeout);
      }
    };
  }, []);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setCurrentSection}
            currentProgress={currentProgress}
            selectedCrewMember={selectedCrewMember}
          />
        );
      case 'character-animator':
        return <CharacterAnimator onBack={() => setCurrentSection('dashboard')} />;
      case 'character-creator':
        return (
          <CharacterCreator 
            onBack={() => setCurrentSection('dashboard')}
            onCharacterCreated={(character) => {
              console.log('Character created:', character);
              setCurrentSection('dashboard');
            }}
          />
        );
      case 'audio-manager':
        return (
          <AudioManager 
            onBack={() => setCurrentSection('dashboard')}
          />
        );
      case 'asset-manager':
        return (
          <AssetManager 
            onBack={() => setCurrentSection('dashboard')}
          />
        );
      case 'project-manager':
        return (
          <ProjectManager 
            onBack={() => setCurrentSection('dashboard')}
          />
        );
      case 'sprite-library':
        return (
          <div className="min-h-screen bg-[#1E1E1E] text-white">
            {isEditorOpen ? (
              <AnimationEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                spriteName={spriteName}
                onSpriteNameChange={setSpriteName}
                animations={animations}
                onAnimationsUpdate={setAnimations}
              />
            ) : (
              <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">Sprite Animation Manager</h1>
                  <button
                    onClick={() => {
                      setSpriteName('');
                      setAnimations([]);
                      setIsEditorOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                  >
                    Create New Sprite
                  </button>
                </div>
                <SpriteLibrary />
              </div>
            )}
          </div>
        );
      default:
        return (
          <Dashboard 
            onNavigate={setCurrentSection}
            currentProgress={currentProgress}
            selectedCrewMember={selectedCrewMember}
          />
        );
    }
  };

  // X-Code Academy View (existing game)
  if (currentSection === 'xcode-academy') {
    const gauntletUnlocked = currentProgress >= 40;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 bg-clip-text text-transparent">
                🎮 X-Code Crew Academy
              </h1>
              <p className="text-lg text-gray-300">
                Learn coding with legendary heroes!
              </p>
            </div>
            
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          {/* Progress Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Lesson Progress</span>
              <span>{currentProgress}/160</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentProgress / 160) * 100}%` }}
              />
            </div>
            {gauntletUnlocked && (
              <div className="mt-2 text-yellow-400 text-sm font-medium text-center">
                🎉 Gauntlet Unlocked! 100 epic levels await!
              </div>
            )}
          </div>

          {/* Level Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentLevel.name}</h2>
                <p className="text-gray-600 text-lg">{currentLevel.description}</p>
                {selectedCrewMember && (
                  <div className="mt-2 text-sm text-purple-600">
                    🎯 <strong>{selectedCrewMember.name}'s Specialty:</strong> {selectedCrewMember.codingSkill}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inline Lesson Plan, Heroes, Sprites buttons and lesson progress */}
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => setShowLessonPlan(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              📚 Lesson Plan
            </button>
            <button
              onClick={() => setShowCrewIntro(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              👥 Heroes
            </button>
            <div className="text-right ml-4">
              <div className="text-sm text-gray-500 mb-1">Lesson</div>
              <div className="text-2xl font-bold text-blue-600">
                {currentProgress} / 160
              </div>
            </div>
          </div>

          {/* Main Game Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Game Grid */}
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <GameGrid
                  width={12}
                  height={10}
                  onExecutionComplete={() => {}}
                  initialPosition={gameState.character.position}
                />
              </div>

              {/* Code Editor */}
              <CodeEditor
                code={code}
                onChange={setCode}
                onRun={runCode}
                onReset={resetLevel}
                onShowHint={handleShowHint}
                onShowSolution={handleShowSolution}
                isRunning={gameState.isRunning}
                level={currentProgress}
                currentExecutingLine={currentExecutingLine}
                codeLines={codeLines}
              />

              {/* Execution Log */}
              <ExecutionLog
                logs={executionLogs}
                isRunning={gameState.isRunning}
              />
            </div>

            {/* Right Column - Stats and Info */}
            <div className="space-y-6">
              {/* Game Stats */}
              <GameStats
                character={gameState.character}
                level={currentProgress}
                totalLevels={160}
                moves={gameState.moves}
                score={gameState.score}
                objective={currentLevel.objective}
              />

              {/* Crew Member Info */}
              {selectedCrewMember && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedCrewMember.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-purple-800">{selectedCrewMember.name}</div>
                      <div className="text-sm text-purple-600">{selectedCrewMember.codingSkill} Master</div>
                    </div>
                  </div>
                  <p className="text-purple-700 text-sm mb-3">{selectedCrewMember.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>💪 Strength:</span>
                      <span className="font-bold">{selectedCrewMember.stats.strength}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🔮 Magic:</span>
                      <span className="font-bold">{selectedCrewMember.stats.magic}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⚡ Speed:</span>
                      <span className="font-bold">{selectedCrewMember.stats.speed}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🧠 Wisdom:</span>
                      <span className="font-bold">{selectedCrewMember.stats.wisdom}/10</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Hints */}
              {showHint && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="font-semibold text-yellow-800">
                      {selectedCrewMember ? `${selectedCrewMember.name}'s Tips` : 'Hints'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {currentLevel.hints.map((hint, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          <LessonPlanViewer
            isOpen={showLessonPlan}
            onClose={() => setShowLessonPlan(false)}
            currentProgress={currentProgress}
            onSelectLesson={handleLessonSelect}
          />

          <CrewIntroduction
            isOpen={showCrewIntro}
            onClose={() => setShowCrewIntro(false)}
            onSelectMember={handleCrewMemberSelect}
            currentProgress={currentProgress}
          />

          {/* Game Over Modal */}
          {gameState.gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="text-6xl mb-4">💀</div>
                <h2 className="text-2xl font-bold text-red-600 mb-4">Hero Down!</h2>
                <p className="text-gray-600 mb-6">
                  {selectedCrewMember 
                    ? `${selectedCrewMember.name} believes in you! Try a different approach!`
                    : 'Your hero has been defeated. Try a different approach!'
                  }
                </p>
                <button
                  onClick={resetLevel}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Level Complete Modal */}
          {gameState.isComplete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">Victory!</h2>
                {selectedCrewMember && (
                  <p className="text-purple-600 mb-2 font-medium">
                    🎉 {selectedCrewMember.name} is proud of your progress!
                  </p>
                )}
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600">Completed in {gameState.moves} moves</p>
                  <p className="text-lg font-semibold text-purple-600">Score: {gameState.score}</p>
                  <p className="text-sm text-blue-600">Lesson {currentProgress}/160 Complete!</p>
                </div>
                {currentLevelIndex < LEVELS.length - 1 ? (
                  <div className="space-y-3">
                    <button
                      onClick={nextLevel}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Next Lesson →
                    </button>
                    <button
                      onClick={resetLevel}
                      className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      🔄 Replay Lesson
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xl font-bold text-purple-600">Course Complete!</div>
                    <p className="text-gray-600">Ready for the Gauntlet challenge?</p>
                    <p className="text-lg font-semibold text-yellow-600">Final Score: {gameState.score}</p>
                    <button
                      onClick={() => {
                        setCurrentLevelIndex(0);
                        resetLevel();
                      }}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;