import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/layout/Canvas';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';

function Visualizer() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden text-zinc-100 font-inter relative">
      <BackgroundEffects />

      <div className="flex flex-col lg:flex-row h-full w-full absolute inset-0 p-4 lg:p-6 gap-6">
        {/* Left Sidebar (AI Input + Explanation) */}
        <div className="w-full lg:w-[35%] xl:w-[30%] flex-shrink-0 z-20 h-full">
          <Sidebar />
        </div>

        {/* Right Area (Visualization + Controls) */}
        <div className="flex-1 w-full relative flex flex-col z-10 h-full">
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
