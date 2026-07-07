import { Text, Card, Button, Icon } from '@gravity-ui/uikit';
import { FileText, ArrowUpRightFromSquare, ArrowDownToLine } from '@gravity-ui/icons';

const reglamentos = [
  {
    title: 'REGLAMENTO GENERAL SIREVE',
    desc: 'Reglamento General del Sistema Regional de Vida Estudiantil (SIREVE) del Consejo Superior Universitario Centroamericano.',
    link: 'https://drive.google.com/file/d/10Xzi970AWcU-wtjjToGSosP54_dXWo-M/view?usp=sharing',
  },
];

export default function Reglamentos() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
        <Icon data={FileText} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Reglamentos</Text>
        <Text variant="header-1" className="page-hero-sub">Normativas y documentos oficiales del SIREVE</Text>
      </div>
      <div className="page-body">
        {reglamentos.map((reg, i) => (
          <Card key={i} view="raised" className="reglamento-card">
            <div className="reglamento-left">
              <Icon data={FileText} size={40} className="reglamento-icon" />
              <div>
                <Text variant="header-1" className="reglamento-title">{reg.title}</Text>
                <Text variant="body-2" color="secondary" className="reglamento-desc">{reg.desc}</Text>
              </div>
            </div>
            <Button view="action" size="l" onClick={() => window.open(reg.link, '_blank')}>
              <Icon data={ArrowDownToLine} size={16} style={{ marginRight: 8 }} />
              CONSULTAR
              <Icon data={ArrowUpRightFromSquare} size={16} style={{ marginLeft: 8 }} />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
