import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Reglamentos from './pages/Reglamentos';
import Actas from './pages/Actas';
import Galeria from './pages/Galeria';
import GaleriaIndex from './pages/GaleriaIndex';
import Contacto from './pages/Contacto';

function App() {
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Routes>
        <Route
          path="/"
          element={<Layout currentTheme={currentTheme} onToggleTheme={toggleTheme} />}
        >
          <Route index element={<LandingPage />} />
          <Route path="reglamentos" element={<Reglamentos />} />
          <Route path="actas" element={<Actas />} />
          <Route path="galeria" element={<GaleriaIndex />} />
          <Route path="galeria/:year" element={<Galeria />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
