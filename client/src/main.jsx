import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { FavoritesProvider } from './lib/hooks';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Saved from './pages/Saved';
import NotFound from './pages/NotFound';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><FavoritesProvider><Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/rackets" element={<Category/>}/>
    <Route path="/shoes" element={<Category/>}/>
    <Route path="/bags" element={<Category/>}/>
    <Route path="/accessories" element={<Category/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/saved" element={<Saved/>}/>
    <Route path="/product/:slug" element={<ProductDetail/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes></Layout></FavoritesProvider></BrowserRouter></React.StrictMode>
);
