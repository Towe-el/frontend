import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home.jsx'
import Info from './pages/Info.jsx';
import History from './pages/History.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/info" element={<Info />} />
      <Route path="/history" element={<History />} />
    </Routes>
  </BrowserRouter>,
)
