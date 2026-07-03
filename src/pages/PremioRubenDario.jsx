import { Text, Icon } from '@gravity-ui/uikit';
import { StarFill } from '@gravity-ui/icons';

export default function PremioRubenDario() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
        <Icon data={StarFill} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Premio Rubén Darío</Text>
        <Text variant="header-1" className="page-hero-sub">Premio Regional a la Excelencia Académica</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            El Premio Regional a la Excelencia Académica "Rubén Darío" se establece mediante Acuerdo Noveno de la XIII Sesión Ordinaria del Consejo Regional de Vida Estudiantil, celebrada en la República de Panamá en el mes de mayo del año 2005. Se crea como un reconocimiento para aquellos estudiantes distinguidos académicamente y que sobresalen en el desarrollo del conocimiento científico, tecnológico y humanista de las diversas ramas del saber.
          </Text>
          <div style={{ height: 16 }} />
          <Text variant="body-2" className="page-text">
            El Consejo Regional de Vida Estudiantil a través de este premio reconoce el esfuerzo, perseverancia y constancia en la excelencia académica de las y los estudiantes en las universidades que conforman el Consejo Superior Universitario Centroamericano y República Dominicana.
          </Text>
        </div>
      </div>
    </div>
  );
}
