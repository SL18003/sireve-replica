import { useParams, Link } from 'react-router-dom';
import { Text, Card, Icon } from '@gravity-ui/uikit';
import { Picture, ChevronLeft } from '@gravity-ui/icons';

const years = ['2017', '2018', '2019'];

const events2017 = [
  { id: '1', title: 'Sesión Comité Directivo CONREVE, Panamá 30 y 31 de mayo 2017' },
  { id: '2', title: 'CEUCA. Costa Rica, 2017' },
  { id: '3', title: 'Unidad de Comunicación CSUCA' },
  { id: '4', title: 'CONADER' },
  { id: '5', title: 'Primera Visita Organización Rubén Darío. El Salvador' },
  { id: '6', title: '1er. Congresillo JUDUCA 2018. Panamá' },
  { id: '7', title: 'Organización Congreso Neurociencias' },
];

const yearData = { '2017': events2017 };

export default function Galeria() {
  const { year } = useParams();
  const items = yearData[year] || [];

  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <Icon data={Picture} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Galería {year}</Text>
        <Text variant="header-1" className="page-hero-sub">Eventos y actividades del SIREVE</Text>
      </div>
      <div className="page-body">
        <div className="galeria-bar">
          {years.map(y => (
            <Link key={y} to={`/galeria/${y}`} className={`galeria-tab ${y === year ? 'active' : ''}`}>{y}</Link>
          ))}
        </div>

        {items.length > 0 ? (
          <>
            <div className="galeria-grid">
              {items.map(item => (
                <Card key={item.id} view="raised" className="galeria-card">
                  <img src={`https://picsum.photos/400/300?random=${item.id}`} alt={item.title} className="galeria-img" />
                  <div className="galeria-body">
                    <Text variant="body-2" className="galeria-label">{item.title}</Text>
                  </div>
                </Card>
              ))}
            </div>
            {year !== '2019' && (
              <div style={{ marginTop: 32 }}>
                <Link to="/galeria/2019" className="back-link"><Icon data={ChevronLeft} size={16} /> Galería más reciente</Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Text variant="body-2" color="secondary">No hay eventos registrados para {year}</Text>
            <div className="galeria-bar" style={{ marginTop: 16, justifyContent: 'center' }}>
              {years.filter(y => y !== year).map(y => (
                <Link key={y} to={`/galeria/${y}`} className="galeria-tab">Ver {y}</Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
