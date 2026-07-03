import { Text, Icon } from '@gravity-ui/uikit';
import { ShieldCheck } from '@gravity-ui/icons';

export default function QueEsSireve() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
        <Icon data={ShieldCheck} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">SIREVE</Text>
        <Text variant="header-1" className="page-hero-sub">Sistema Regional de Vida Estudiantil</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            El Sistema Regional de Vida Estudiantil (SIREVE), es el órgano del Consejo Superior Universitario Centroamericano CSUCA, que a través del Consejo Regional de Vida Estudiantil (CONREVE), está encargado de coordinar, promover, fortalecer y generar iniciativas, programas y proyectos que impulsen el desarrollo del área de Vida Estudiantil de las Universidades miembros; contribuyendo a la formación integral de profesionales que participen con compromiso social, en la transformación, desarrollo e Integración de los países miembros del Sistema de Integración Centroamericana SICA.
          </Text>
        </div>
      </div>
    </div>
  );
}
