import { useState, useEffect } from 'react';
import { Cube } from './Cube';
import { CubeView, Cube3DView } from './components/CubeView';
import { LearnMode } from './components/LearnMode';
import { InteractiveCube, PatternLibrary } from './components/InteractiveCube';

import './App.css';

interface AppStats {
  totalSolves: number;
  averageTime: number;
  bestTime: number;
  scrambleCount: number;
}

function AppContent() {
  const [cube] = useState(() => new Cube());
  const [, setRerender] = useState(0);
  const [currentMode, setCurrentMode] = useState<'home' | 'learn' | 'practice' | 'stats' | 'interactive' | 'patterns'>('home');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [stats, setStats] = useState<AppStats>(() => {
    const saved = localStorage.getItem('rubik-cube-stats');
    return saved ? JSON.parse(saved) : {
      totalSolves: 0,
      averageTime: 0,
      bestTime: 0,
      scrambleCount: 0
    };
  });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    localStorage.setItem('rubik-cube-stats', JSON.stringify(stats));
  }, [stats]);

  const handleScramble = () => {
    cube.scramble();
    setStats(prev => ({ ...prev, scrambleCount: prev.scrambleCount + 1 }));
    setRerender(r => r + 1);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleReset = () => {
    cube.reset();
    setRerender(r => r + 1);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const handleStartTimer = () => {
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    const timeInSeconds = timer / 100;
    setStats(prev => ({
      ...prev,
      totalSolves: prev.totalSolves + 1,
      bestTime: prev.bestTime === 0 ? timeInSeconds : Math.min(prev.bestTime, timeInSeconds),
      averageTime: ((prev.averageTime * (prev.totalSolves - 1)) + timeInSeconds) / prev.totalSolves
    }));
  };

  const formatTime = (centiseconds: number) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const renderHome = () => (
    <div className="main-content">
      <div className="stats-panel">
        <div className="stat-card">
          <div className="stat-value">{stats.totalSolves}</div>
          <div className="stat-label">Total Solves</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bestTime > 0 ? formatTime(stats.bestTime * 100) : '--:--'}</div>
          <div className="stat-label">Best Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.averageTime > 0 ? formatTime(stats.averageTime * 100) : '--:--'}</div>
          <div className="stat-label">Average</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.scrambleCount}</div>
          <div className="stat-label">Scrambles</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Current Cube</h2>
          <div className="flex items-center gap-md">
            <div className="badge badge-info">
              Timer: {formatTime(timer)}
            </div>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
            >
              {viewMode === '2d' ? '3D View' : '2D View'}
            </button>
          </div>
        </div>
        
        {viewMode === '2d' ? (
          <CubeView state={cube.state} size="large" />
        ) : (
          <Cube3DView state={cube.state} />
        )}
      </div>

      <div className="control-panel">
        <button className="btn btn-primary" onClick={handleScramble}>
          🎲 Scramble
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          🔄 Reset
        </button>
        <button 
          className={`btn ${isTimerRunning ? 'btn-accent' : 'btn-outline'}`}
          onClick={isTimerRunning ? handleStopTimer : handleStartTimer}
        >
          {isTimerRunning ? '⏹️ Stop Timer' : '⏱️ Start Timer'}
        </button>
        <button className="btn btn-primary" onClick={() => setCurrentMode('learn')}>
          🎓 Learn Mode
        </button>
      </div>

      <div className="feature-grid">
        <div className="feature-card" onClick={() => setCurrentMode('learn')}>
          <span className="feature-icon">🎓</span>
          <h3 className="feature-title">Learn to Solve</h3>
          <p className="feature-description">
            Step-by-step guided solving with AI explanations and voice narration
          </p>
        </div>
        
        <div className="feature-card" onClick={() => setCurrentMode('practice')}>
          <span className="feature-icon">⚡</span>
          <h3 className="feature-title">Practice Mode</h3>
          <p className="feature-description">
            Time your solves, track progress, and improve your solving speed
          </p>
        </div>
        
        <div className="feature-card" onClick={() => setCurrentMode('interactive')}>
          <span className="feature-icon">🎮</span>
          <h3 className="feature-title">Interactive Mode</h3>
          <p className="feature-description">
            Manually manipulate the cube with click controls and move recording
          </p>
        </div>
        
        <div className="feature-card" onClick={() => setCurrentMode('patterns')}>
          <span className="feature-icon">🎨</span>
          <h3 className="feature-title">Pattern Library</h3>
          <p className="feature-description">
            Apply beautiful cube patterns like checkerboard, cube-in-cube, and more
          </p>
        </div>
        
        <div className="feature-card" onClick={() => setCurrentMode('stats')}>
          <span className="feature-icon">📊</span>
          <h3 className="feature-title">Statistics</h3>
          <p className="feature-description">
            View detailed solving statistics, progress charts, and achievements
          </p>
        </div>
      </div>
    </div>
  );

  const renderPracticeMode = () => (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Practice Mode</h2>
        </div>
        
        <div className="text-center p-lg">
          <div className="text-3xl font-bold mb-lg" style={{ color: 'var(--primary-color)' }}>
            {formatTime(timer)}
          </div>
          
          <CubeView state={cube.state} size="large" />
          
          <div className="control-panel" style={{ marginTop: 'var(--spacing-xl)' }}>
            <button className="btn btn-primary" onClick={handleScramble}>
              New Scramble
            </button>
            <button 
              className={`btn ${isTimerRunning ? 'btn-accent' : 'btn-secondary'}`}
              onClick={isTimerRunning ? handleStopTimer : handleStartTimer}
            >
              {isTimerRunning ? 'Stop' : 'Start'}
            </button>
            <button className="btn btn-outline" onClick={handleReset}>
              Reset Cube
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatsMode = () => (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Statistics</h2>
        </div>
        
        <div className="stats-panel">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSolves}</div>
            <div className="stat-label">Total Solves</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.scrambleCount}</div>
            <div className="stat-label">Total Scrambles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.bestTime > 0 ? formatTime(stats.bestTime * 100) : 'N/A'}</div>
            <div className="stat-label">Personal Best</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.averageTime > 0 ? formatTime(stats.averageTime * 100) : 'N/A'}</div>
            <div className="stat-label">Average Time</div>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
          <h3>Progress Overview</h3>
          <p className="text-secondary">
            {stats.totalSolves === 0 
              ? "Start solving to see your progress!" 
              : `You've completed ${stats.totalSolves} solve${stats.totalSolves === 1 ? '' : 's'} with an average time of ${formatTime(stats.averageTime * 100)}.`
            }
          </p>
          
          {stats.totalSolves > 0 && (
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((stats.totalSolves / 100) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted" style={{ marginTop: 'var(--spacing-sm)' }}>
                Progress towards 100 solves: {stats.totalSolves}/100
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNavigation = () => (
    <nav className="main-nav">
      <button onClick={() => setCurrentMode('home')} className={currentMode === 'home' ? 'active' : ''}>Home</button>
      <button onClick={() => setCurrentMode('learn')} className={currentMode === 'learn' ? 'active' : ''}>Learn</button>
      <button onClick={() => setCurrentMode('practice')} className={currentMode === 'practice' ? 'active' : ''}>Practice</button>
      <button onClick={() => setCurrentMode('interactive')} className={currentMode === 'interactive' ? 'active' : ''}>Interactive</button>
      <button onClick={() => setCurrentMode('patterns')} className={currentMode === 'patterns' ? 'active' : ''}>Patterns</button>
      <button onClick={() => setCurrentMode('stats')} className={currentMode === 'stats' ? 'active' : ''}>Stats</button>
    </nav>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Rubik's Cube Solver</h1>
        <p className="app-subtitle">Master the cube with AI-powered learning</p>
      </header>

      {renderNavigation()}

      <main className="main-content-area">
        {currentMode === 'home' && renderHome()}
        {currentMode === 'learn' && (
          <div className="card">
            <LearnMode cube={cube} />
          </div>
        )}
        {currentMode === 'practice' && renderPracticeMode()}
        {currentMode === 'interactive' && (
          <div className="card">
            <InteractiveCube cube={cube} onCubeChange={() => setRerender(r => r + 1)} />
          </div>
        )}
        {currentMode === 'patterns' && (
          <PatternLibrary cube={cube} onApplyPattern={() => setRerender(r => r + 1)} />
        )}
        {currentMode === 'stats' && renderStatsMode()}
      </main>
    </div>
  );
}



export default AppContent;
