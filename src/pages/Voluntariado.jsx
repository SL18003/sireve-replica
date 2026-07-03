import { Text, Icon } from '@gravity-ui/uikit';
import { Person } from '@gravity-ui/icons';

export default function Voluntariado() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
        <Icon data={Person} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Voluntariado</Text>
        <Text variant="header-1" className="page-hero-sub">Red UNIVOCES de Voluntariado Universitario</Text>
      </div>
      <div className="page-body">
        <div className="page-card">
          <Text variant="body-2" className="page-text">
            El voluntariado es el ejercicio libre, organizado y no remunerado de la solidaridad ciudadana en actividades y programas que van en beneficio de la humanidad y su entorno en general. El cual se ejerce en las universidades a través del Programa de Voluntariado del Sistema Regional de Vida Estudiantil, mediante la Red UNIVOCES, el cual promueve el voluntariado como actividad de compromiso social universitario que complementa el proceso enseñanza-aprendizaje y el desarrollo integral estudiantil universitario.
          </Text>
        </div>
      </div>
    </div>
  );
}
