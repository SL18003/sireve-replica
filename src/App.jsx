import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Reglamentos from './pages/Reglamentos';
import Actas from './pages/Actas';
import Galeria from './pages/Galeria';
import GaleriaIndex from './pages/GaleriaIndex';
import Contacto from './pages/Contacto';
import Programa from './pages/Programa';

/* React Router v6+ no restaura el scroll al navegar. Al tocar "Ver programa"
   desde la landing ya scrolleada se conservaba la posicion vertical, y como la
   pagina de programa es mas corta se caia de golpe al footer. Al cambiar de
   ruta se vuelve al inicio. Si la ruta trae hash (p.ej. "/#programas") no se
   toca nada: de eso se encarga Header.jsx con su desplazamiento suave. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // iOS Safari restaura la posicion del scroll DESPUES del render y pisaba el
    // scrollTo de abajo. En 'manual' el scroll lo maneja solo la app.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hash && document.getElementById(hash.slice(1))) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme="light">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="reglamentos" element={<Reglamentos />} />
          <Route path="actas" element={<Actas />} />
          <Route path="galeria" element={<GaleriaIndex />} />
          <Route path="galeria/:year" element={<Galeria />} />
          <Route path="programas/:slug" element={<Programa />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
