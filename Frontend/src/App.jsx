import React,{ useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './pages/HomePage';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Blog from './pages/BlogPage';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/blog' element={<Blog/>}/>
      </Routes>
    </Router>
  )
}

export default App
