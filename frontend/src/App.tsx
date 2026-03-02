import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/layout/Canvas';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { ErrorBoundary } from './components/ErrorBoundary';

function Visualizer() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden text-zinc-100 font-inter">
      <ErrorBoundary>
        {/* Left Sidebar (AI Input + Explanation) - 40% */}
        <div className="w-full lg:w-[40%] flex-shrink-0 z-20">
          <Sidebar />
        </div>

        {/* Right Area (Visualization + Controls) - 60% */}
        <div className="flex-1 w-full lg:w-[60%] relative flex flex-col z-10">
          <Canvas />
          <PlaybackControls />
        </div>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Visualizer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
