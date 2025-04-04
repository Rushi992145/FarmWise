import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './pages/HomePage';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Blog from './pages/BlogPage';
import Footer from './components/Footer';
import AiPage from './pages/AiPage';
import NewsPage from './pages/NewsPage';
import DiscussionPage from './pages/DiscussionPage';
import { useDispatch } from 'react-redux';
import { getMe } from './store/features/authSlice';
import ProfilePage from './pages/ProfilePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getMe());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <div className="py-6">
          <Navbar />
        </div>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/aisathi" element={<AiPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/discussion" element={<DiscussionPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App
