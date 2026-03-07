import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/layout/Canvas';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';

import { useNavigate } from 'react-router-dom';

function Visualizer() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full lg:h-screen lg:overflow-hidden overflow-y-auto text-zinc-100 font-inter relative">
      <BackgroundEffects />

      <div className="flex flex-col lg:flex-row h-full w-full lg:absolute lg:inset-0 p-4 lg:p-6 gap-4 lg:gap-6 relative">
        {/* Left Sidebar (AI Input + Explanation) */}
        <div className="w-full lg:w-[35%] xl:w-[30%] order-2 lg:order-1 flex-shrink-0 z-20 h-auto lg:h-full min-h-[60vh] lg:min-h-0 pb-24 lg:pb-0">
          <Sidebar onNavigateToProfile={() => navigate('/profile')} />
        </div>

        {/* Right Area (Visualization + Controls) */}
        <div className="flex-1 min-w-0 w-full relative flex flex-col z-10 h-[60vh] lg:h-full order-1 lg:order-2">
          <Canvas />
          <PlaybackControls />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Visualizer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
