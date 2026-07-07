import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, Button, Icon } from '@gravity-ui/uikit';
import { Sun, Moon } from '@gravity-ui/icons';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import QueEsSireve from './pages/QueEsSireve';
import Ficcua from './pages/Ficcua';
import Juduca from './pages/Juduca';
import PremioRubenDario from './pages/PremioRubenDario';
import PromotorasSalud from './pages/PromotorasSalud';
import Voluntariado from './pages/Voluntariado';
import Actas from './pages/Actas';
import Galeria from './pages/Galeria';
import Reglamentos from './pages/Reglamentos';
import Contacto from './pages/Contacto';
import './App.css';

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
          <Route path="sireve" element={<QueEsSireve />} />
          <Route path="ficcua" element={<Ficcua />} />
          <Route path="juduca" element={<Juduca />} />
          <Route path="excelencia-academica" element={<PremioRubenDario />} />
          <Route path="promotoras-salud" element={<PromotorasSalud />} />
          <Route path="voluntariado" element={<Voluntariado />} />
          <Route path="actas" element={<Actas />} />
          <Route path="galeria/:year" element={<Galeria />} />
          <Route path="reglamentos" element={<Reglamentos />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        <Button size="xl" view="action" onClick={toggleTheme} pin="circle">
          <Icon data={currentTheme === 'light' ? Moon : Sun} size={24} />
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
