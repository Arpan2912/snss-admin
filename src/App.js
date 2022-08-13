import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from "react-router-dom";
// import Header from './components/Header';
import './App.css';
import AddBlog from './pages/AddBlog';
import Blogs from './pages/Blogs';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
const { innerWidth, innerHeight } = window;


function App() {
  return (
    <div className="App">
      {/* <Header></Header> */}
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/add-blog" element={<AddBlog />} />
      </Routes>
    </div>
  );
}

export default App;
