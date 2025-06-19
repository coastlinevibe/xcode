import React, { useState } from 'react';
import { 
  Play, 
  Users, 
  Settings, 
  BookOpen, 
  Trophy, 
  Gamepad2, 
  Palette, 
  Volume2, 
  FolderOpen, 
  Code, 
  Star,
  Zap,
  Target,
  Crown,
  Sword,
  Wand2,
  ArrowRight,
  Plus,
  Music,
  Image,
  Save,
  User
} from 'lucide-react';
import { CrewMember } from '../data/story';
import { CharacterAnimator } from './CharacterAnimator';

interface DashboardProps {
  onNavigate: (section: string) => void;
  currentProgress: number;
  selectedCrewMember: CrewMember | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  currentProgress,
  selectedCrewMember
}) => {
  const [activeSection, setActiveSection] = useState('overview');

  const progressPercentage = (currentProgress / 160) * 100;
  const gauntletUnlocked = currentProgress >= 40;

  const getCrewMemberIcon = (member: CrewMember | null) => {
    if (!member) return <User className="w-6 h-6" />;
    
    switch (member.gauntletClass) {
      case 'warrior': return <Sword className="w-6 h-6" />;
      case 'valkyrie': return <Crown className="w-6 h-6" />;
      case 'wizard': return <Wand2 className="w-6 h-6" />;
      case 'elf': return <Target className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getCrewMemberColor = (member: CrewMember | null) => {
    if (!member) return 'from-gray-500 to-gray-700';
    
    switch (member.gauntletClass) {
      case 'warrior': return 'from-red-500 to-red-700';
      case 'valkyrie': return 'from-purple-500 to-purple-700';
      case 'wizard': return 'from-blue-500 to-blue-700';
      case 'elf': return 'from-green-500 to-green-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🎮 RockPaperScissorCode</h1>
              <p className="text-xl text-purple-100">Complete Development Dashboard</p>
            </div>
            
            {/* Current Mentor Display */}
            {selectedCrewMember && (
              <div className={`bg-gradient-to-r ${getCrewMemberColor(selectedCrewMember)} bg-opacity-20 border border-white border-opacity-30 rounded-xl p-4`}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    {getCrewMemberIcon(selectedCrewMember)}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{selectedCrewMember.name}</div>
                    <div className="text-sm opacity-90">{selectedCrewMember.codingSkill} Master</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <BookOpen className="w-6 h-6 text-blue-300" />
                <span className="font-semibold">Learning Progress</span>
              </div>
              <div className="text-2xl font-bold mb-2">{currentProgress}/160 Lessons</div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-sm opacity-75 mt-1">{Math.round(progressPercentage)}% Complete</div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-300" />
                <span className="font-semibold">Achievements</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {currentProgress >= 40 ? '🏰' : currentProgress >= 20 ? '⚔️' : currentProgress >= 10 ? '🧙‍♂️' : '👶'} 
                {currentProgress >= 40 ? ' Hero' : currentProgress >= 20 ? ' Warrior' : currentProgress >= 10 ? ' Apprentice' : ' Beginner'}
              </div>
              <div className="text-sm opacity-75">
                {gauntletUnlocked ? 'Gauntlet Unlocked!' : `${40 - currentProgress} lessons to Gauntlet`}
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-green-300" />
                <span className="font-semibold">Active Mentors</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {currentProgress >= 25 ? '4' : currentProgress >= 15 ? '3' : currentProgress >= 10 ? '2' : '1'}/4 Unlocked
              </div>
              <div className="text-sm opacity-75">
                {selectedCrewMember ? `Training with ${selectedCrewMember.name}` : 'No mentor selected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white bg-opacity-10 border-b border-white border-opacity-20">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'tools', label: 'Tools', icon: Settings },
              { id: 'projects', label: 'Projects', icon: FolderOpen }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-4 border-b-2 transition-all duration-200
                  ${activeSection === id 
                    ? 'border-blue-400 text-blue-300' 
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-400'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => onNavigate('xcode-academy')}
                className="group bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Play className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Continue Learning</h3>
                    <p className="text-blue-100">X-Code Crew Academy</p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm opacity-75 mb-2">Lesson {currentProgress}/160</div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm">Resume your journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {gauntletUnlocked && (
                <button className="group bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                      <Gamepad2 className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold">The Great Gauntlet</h3>
                      <p className="text-yellow-100">100 Epic Levels</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-75 mb-2">Adventure Mode Unlocked!</div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm">Epic coding challenges await</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm">Enter the Gauntlet</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )}

              <button
                onClick={() => onNavigate('character-animator')}
                className="group bg-gradient-to-br from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Character Animator</h3>
                    <p className="text-green-100">Design & Animate Heroes</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Create characters and design their animations with our visual editor
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create & Animate</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-xl">
                  <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                    <Star className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Completed Lesson {currentProgress}</div>
                    <div className="text-sm text-gray-300">Earned 100 XP • 2 hours ago</div>
                  </div>
                  <div className="text-green-400 font-bold">+100 XP</div>
                </div>
                
                {selectedCrewMember && (
                  <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-xl">
                    <div className={`p-2 bg-gradient-to-r ${getCrewMemberColor(selectedCrewMember)} bg-opacity-20 rounded-lg`}>
                      {getCrewMemberIcon(selectedCrewMember)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Training with {selectedCrewMember.name}</div>
                      <div className="text-sm text-gray-300">Learning {selectedCrewMember.codingSkill} • Active</div>
                    </div>
                    <div className="text-blue-400 font-bold">Active</div>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 p-4 bg-white bg-opacity-5 rounded-xl">
                  <div className="p-2 bg-purple-500 bg-opacity-20 rounded-lg">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">Achievement Unlocked</div>
                    <div className="text-sm text-gray-300">First Steps • 1 day ago</div>
                  </div>
                  <div className="text-purple-400 font-bold">🏆</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'courses' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Learning Paths</h2>
              <p className="text-gray-300 text-lg">Choose your coding adventure</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* X-Code Academy */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">X-Code Crew Academy</h3>
                    <p className="text-blue-100">160 Structured Lessons</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Progress</span>
                    <span className="font-bold">{currentProgress}/160</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm opacity-75">Mentors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">40</div>
                      <div className="text-sm opacity-75">Concepts</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => onNavigate('xcode-academy')}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Gauntlet */}
              <div className={`bg-gradient-to-br ${gauntletUnlocked ? 'from-yellow-500 to-orange-600' : 'from-gray-600 to-gray-700'} rounded-2xl p-8 text-white ${!gauntletUnlocked ? 'opacity-60' : ''}`}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">The Great Gauntlet</h3>
                    <p className={gauntletUnlocked ? "text-yellow-100" : "text-gray-300"}>100 Epic Adventures</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-bold">{gauntletUnlocked ? 'Unlocked!' : 'Locked'}</span>
                  </div>
                  
                  {!gauntletUnlocked && (
                    <div className="text-sm opacity-75">
                      Complete {40 - currentProgress} more lessons to unlock
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">100</div>
                      <div className="text-sm opacity-75">Levels</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm opacity-75">Floors</div>
                    </div>
                  </div>
                </div>
                
                <button
                  disabled={!gauntletUnlocked}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    gauntletUnlocked 
                      ? 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white' 
                      : 'bg-gray-500 bg-opacity-50 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <span>{gauntletUnlocked ? 'Enter Gauntlet' : 'Complete CS1 to Unlock'}</span>
                  {gauntletUnlocked && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'tools' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Development Tools</h2>
              <p className="text-gray-300 text-lg">Everything you need to create amazing games</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => onNavigate('character-animator')}
                className="group bg-gradient-to-br from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Character Animator</h3>
                    <p className="text-green-100">Design & Animate Heroes</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Create characters and design their animations with our visual editor
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create & Animate</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('audio-manager')}
                className="group bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Audio Manager</h3>
                    <p className="text-purple-100">Sound & Music</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Upload, organize, and manage all your game audio assets
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Audio</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => onNavigate('asset-manager')}
                className="group bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Image className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Asset Manager</h3>
                    <p className="text-orange-100">Graphics & Sprites</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Organize sprites, backgrounds, and visual assets
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manage Assets</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Code className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Code Editor</h3>
                    <p className="text-blue-100">Built-in IDE</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Advanced code editor with syntax highlighting and debugging
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Integrated in Academy</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-6 rounded-2xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Palette className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Sprite Manager</h3>
                    <p className="text-teal-100">Animation System</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Construct 3-style sprite animation management
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Integrated in Academy</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 rounded-2xl opacity-60">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Settings className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Level Editor</h3>
                    <p className="text-gray-300">Coming Soon</p>
                  </div>
                </div>
                <div className="text-left text-sm opacity-75 mb-4">
                  Visual level design tool for creating custom challenges
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In Development</span>
                  <Plus className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
                <p className="text-gray-300 text-lg">Manage and organize your coding projects</p>
              </div>
              <button
                onClick={() => onNavigate('project-manager')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Projects */}
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 hover:bg-opacity-15 transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-blue-500 bg-opacity-20 rounded-xl">
                    <Gamepad2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">My First Game</h3>
                    <p className="text-gray-300 text-sm">Simple platformer</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Created 2 days ago • Last modified 1 hour ago
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-400">✓ Completed</span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Open →
                  </button>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-2xl p-6 hover:bg-opacity-15 transition-all duration-200">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-500 bg-opacity-20 rounded-xl">
                    <Code className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Loop Challenge</h3>
                    <p className="text-gray-300 text-sm">Practice project</p>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                  Created 1 week ago • Last modified 3 days ago
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-400">⚡ In Progress</span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    Open →
                  </button>
                </div>
              </div>

              <button
                onClick={() => onNavigate('project-manager')}
                className="bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white p-6 rounded-2xl border-2 border-dashed border-gray-500 hover:border-gray-400 transition-all duration-200 flex flex-col items-center justify-center space-y-4"
              >
                <div className="p-4 bg-white bg-opacity-10 rounded-xl">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">Create New Project</div>
                  <div className="text-gray-300 text-sm">Start a new coding adventure</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};