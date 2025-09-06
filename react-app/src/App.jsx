import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import RequireAuthReady from './components/RequireAuthReady';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StoryPage from './pages/StoryPage';
import CreateStory from './pages/CreateStory';
import MyReads from './pages/MyReads';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import Notifications from './pages/Notifications';

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      {user && <Header />}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes Wrapped in RequireAuthReady */}
        <Route
          path="/dashboard"
          element={
            <RequireAuthReady>
              <Dashboard />
            </RequireAuthReady>
          }
        />
        <Route
          path="/story/:storyId"
          element={
            <RequireAuthReady>
              <StoryPage />
            </RequireAuthReady>
          }
        />
        <Route
          path="/create-story"
          element={
            <RequireAuthReady>
              <CreateStory />
            </RequireAuthReady>
          }
        />
        <Route
          path="/my-reads"
          element={
            <RequireAuthReady>
              <MyReads />
            </RequireAuthReady>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <RequireAuthReady>
              <Profile />
            </RequireAuthReady>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuthReady>
              <Settings />
            </RequireAuthReady>
          }
        />
        <Route
          path="/notifications"
          element={
            <RequireAuthReady>
              <Notifications />
            </RequireAuthReady>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
