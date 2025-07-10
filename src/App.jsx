// src/App.jsx
import React from 'react';
import Gallery from './components/Gallery';
import './index.css';   // 如果有全局样式

export default function App() {
  return (
    <React.StrictMode>
      <Gallery />
    </React.StrictMode>
  );
}
