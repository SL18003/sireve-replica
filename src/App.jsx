import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, Button, Icon } from '@gravity-ui/uikit';
import { Sun, Moon } from '@gravity-ui/icons';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Reglamentos from './pages/Reglamentos';
import Actas from './pages/Actas';
import Galeria from './pages/Galeria';
import Contacto from './pages/Contacto';
import './App.css'; // Might not need it if I clear it, or keep it for global resets

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="reglamentos" element={<Reglamentos />} />
          <Route path="actas" element={<Actas />} />
          <Route path="galeria/:year" element={<Galeria />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>
      
      {/* Floating Theme Toggle Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        <Button size="xl" view="action" onClick={toggleTheme} pin="circle">
          <Icon data={currentTheme === 'light' ? Moon : Sun} size={24} />
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
