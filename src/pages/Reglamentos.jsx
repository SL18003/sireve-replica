import { Text, Icon } from '@gravity-ui/uikit';
import { FileText } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Reglamentos.css';

const REGLEMENTO_PDF_URL = 'https://drive.google.com/file/d/10Xzi970AWcU-wtjjToGSosP54_dXWo-M/view?usp=sharing';

const reglamentos = [
  {
    id: '1',
    title: 'REGLAMENTO GENERAL SIREVE',
    url: REGLEMENTO_PDF_URL,
  },
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
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reglamentos-item-btn"
              >
                Consultar
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
