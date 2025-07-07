import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';  // 如果有全局样式

const container = document.getElementById('app');
createRoot(container).render(<App />);
