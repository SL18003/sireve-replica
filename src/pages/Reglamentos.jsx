import { Text, Button, Icon } from '@gravity-ui/uikit';
import { FileText } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Reglamentos.css';

const reglamentos = [
  { id: '1', title: 'REGLAMENTO GENERAL SIREVE' },
];

export default function Reglamentos() {
  return (
    <div className="page-wrap">
      <PageHeader
        title="Reglamentos"
        subtitle="Normativas vigentes del Sistema Regional de Vida Estudiantil"
        icon={FileText}
      />
      <div className="page-body">
        <div className="reglamentos-list">
          {reglamentos.map((item) => (
            <div key={item.id} className="reglamentos-item">
              <div className="reglamentos-item-icon">
                <Icon data={FileText} size={20} />
              </div>
              <Text variant="body-1" className="reglamentos-item-title">{item.title}</Text>
              <Button view="action" size="m" className="reglamentos-item-btn">Consultar</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
