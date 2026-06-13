import React from 'react';
import { Routes, Route } from "react-router-dom";
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import AddBlog from './pages/AddBlog';
import Blogs from './pages/Blogs';
import AddArticle from './pages/AddArticle';
import Articles from './pages/Articles';
import News from './pages/News';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Header />
            <Blogs />
          </ProtectedRoute>
        } />
        <Route path="/add-blog" element={
          <ProtectedRoute>
            <Header />
            <AddBlog />
          </ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute>
            <Header />
            <News />
          </ProtectedRoute>
        } />
        <Route path="/articles" element={
          <ProtectedRoute>
            <Header />
            <Articles />
          </ProtectedRoute>
        } />
        <Route path="/add-article" element={
          <ProtectedRoute>
            <Header />
            <AddArticle />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
