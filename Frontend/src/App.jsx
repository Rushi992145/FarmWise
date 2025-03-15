import React,{ useState } from 'react'
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

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/aisathi" element={<AiPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/discussion" element={<DiscussionPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App
