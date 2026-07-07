import { Text, Icon } from '@gravity-ui/uikit';
import { HeartPulse } from '@gravity-ui/icons';

export default function PromotorasSalud() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
        <Icon data={HeartPulse} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Promotoras de Salud</Text>
        <Text variant="header-1" className="page-hero-sub">Red Centroamericana y Caribeña de Universidades Promotoras de la Salud</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            La Promoción de la Salud es aquella actividad que brinda la oportunidad de promover y concientizar a las personas sobre la prevención y así brindar las herramientas necesarias para un mayor control de la Salud. El cual se ejerce en las universidades a través del Programa de Universidades Promotoras de la Salud y del Sistema Regional de Vida Estudiantil, mediante la Red Centroamericana y Caribeña de Universidades Promotoras de la Salud REDCCUPS, La cual promueve la Promoción de la salud como actividad de compromiso social universitario que complementa el proceso enseñanza-aprendizaje y el desarrollo integral estudiantil universitario.
          </Text>
        </div>
      </div>
    </div>
  );
}
