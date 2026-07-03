import { useState } from 'react';
import { Text, Button, Icon, Modal } from '@gravity-ui/uikit';
import { FileText } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Reglamentos.css';

const reglamentos = [
  {
    id: '1',
    title: 'REGLAMENTO GENERAL SIREVE',
    summary: 'Normativa que regula el funcionamiento del Sistema Regional de Vida Estudiantil y del CONREVE.',
    pages: '48 páginas',
    updated: 'Última actualización: 2019',
  },
];

export default function Reglamentos() {
  const [openId, setOpenId] = useState(null);
  const active = reglamentos.find((r) => r.id === openId);

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
              <Button
                view="action"
                size="m"
                className="reglamentos-item-btn"
                onClick={() => setOpenId(item.id)}
              >
                Consultar
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={Boolean(active)} onClose={() => setOpenId(null)}>
        {active && (
          <div className="reglamentos-modal">
            <Text variant="header-1" className="reglamentos-modal-title">{active.title}</Text>
            <Text variant="body-2" color="secondary" className="reglamentos-modal-summary">
              {active.summary}
            </Text>
            <div className="reglamentos-modal-preview">
              <Icon data={FileText} size={48} />
              <Text variant="body-2" color="secondary">
                Vista previa de demostración — documento PDF
              </Text>
              <Text variant="caption-2" color="secondary">
                {active.pages} · {active.updated}
              </Text>
            </div>
            <div className="reglamentos-modal-actions">
              <Button view="action" onClick={() => window.alert('En producción, aquí se descargaría el PDF del reglamento.')}>
                Descargar PDF
              </Button>
              <Button view="flat" onClick={() => setOpenId(null)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
