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
import NewChapter from './pages/NewChapter';          // new chapter creation page
import ChapterReader from './pages/ChapterReader'; // chapter reading + comments
import MyReads from './pages/MyReads';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import GenrePage from './pages/GenrePage';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      {user && <Header />}
      <div className="main-content">
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
            path="/story/:storyId/new-chapter"
            element={
              <RequireAuthReady>
                <NewChapter />
              </RequireAuthReady>
            }
          />
          <Route
            path="/story/:storyId/chapter/:chapterNumber"
            element={
              <RequireAuthReady>
                <ChapterReader />
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
          <Route
            path="/stories/genre/:genreName"
            element={
              <RequireAuthReady>
                <GenrePage />
              </RequireAuthReady>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
