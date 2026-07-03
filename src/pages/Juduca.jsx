import { Text, Icon } from '@gravity-ui/uikit';
import { StarFill } from '@gravity-ui/icons';

export default function Juduca() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
        <Icon data={StarFill} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">JUDUCA</Text>
        <Text variant="header-1" className="page-hero-sub">Juegos Deportivos Universitarios Centroamericanos</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            El Consejo Regional de Vida Estudiantil (CONREVE), órgano del Consejo Superior Universitario Centroamericano (CSUCA), celebra los Juegos Deportivos Universitarios Centroamericanos (JUDUCA) con el objetivo común de contribuir al fortalecimiento de la integración, la solidaridad y la paz entre nuestras universidades de la región.
          </Text>
        </div>
      </div>
    </div>
  );
}
