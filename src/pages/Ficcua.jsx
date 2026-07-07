import { Text, Icon } from '@gravity-ui/uikit';
import { StarFill } from '@gravity-ui/icons';

export default function Ficcua() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
        <Icon data={StarFill} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">FICCUA</Text>
        <Text variant="header-1" className="page-hero-sub">Festival Interuniversitario Centroamericano de la Cultura y el Arte</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            El FICCUA es un evento bienal e itinerante de artistas estudiantiles universitarios, promovido por el Consejo Superior Universitario Centroamericano y la Secretaría Adjunta para Asuntos Estudiantiles. El FICCUA busca promover la educación integral, articulación del estudiantado centroamericano y proyección universitaria de la región en un marco de hermandad, diversidad, equidad e inclusión, mediante la expresión de distintas manifestaciones artísticas.
          </Text>
        </div>
      </div>
    </div>
  );
}
