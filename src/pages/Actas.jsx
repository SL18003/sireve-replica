import { Text, Card, Button, Icon } from '@gravity-ui/uikit';
import { Folder, ArrowUpRightFromSquare } from '@gravity-ui/icons';

const actasCategories = [
  {
    title: 'CONSEJO DIRECTIVO CONREVE',
    desc: 'Aquí podrás encontrar las actas del comité directivo, el cual es el órgano propositivo del CONREVE.',
    link: 'https://drive.google.com/open?id=1lOTQdIyd4qffetTIOtlz5vlaYvx2aE_h',
  },
  {
    title: 'FICCUA',
    desc: 'Detalles de los Congresos Pre FICCUA, los cuales se enmarcan en la organización previa al evento macro estudiantil de la Cultura y el Arte del CSUCA.',
    link: 'https://drive.google.com/open?id=1DfOaQ_DFvqHXgVvk5X19PlLu44JK_Hc4',
  },
  {
    title: 'JUDUCA',
    desc: 'Detalles de los Congresos Pre JUDUCA, los cuales se enmarcan en la organización previa al evento macro estudiantil de deporte del CSUCA.',
    link: 'https://drive.google.com/open?id=1Wfw6WwTzJWllWrIAGM6qs_hnoNc3Q35g',
  },
  {
    title: 'PROMOTORAS DE LA SALUD',
    desc: 'Detalles de los Acuerdos tomados en las Asambleas General de delegados docentes, funcionarios y estudiantes.',
    link: 'https://drive.google.com/open?id=1-y2M78ic5uRzOBZKeAF08BqGEkYb1E_W',
  },
  {
    title: 'SESIONES CONREVE',
    desc: 'El Consejo Regional de Vida Estudiantil se reunirá ordinariamente dos veces por año y extraordinariamente cuando el Comité Directivo lo decida.',
    link: 'https://drive.google.com/open?id=1rx_yImAJi__RcTDTp6Mv61FYJ0hc5h1Q',
  },
];

export default function Actas() {
  return (
    <div className="page-wrap">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)' }}>
        <Icon data={Folder} size={48} className="page-hero-icon" />
        <Text variant="display-2" as="h1" className="page-hero-title">Actas SIREVE</Text>
        <Text variant="header-1" className="page-hero-sub">Documentos y registros oficiales del CONREVE</Text>
      </div>
      <div className="page-body">
        <div className="actas-grid">
          {actasCategories.map((cat, i) => (
            <Card key={i} view="raised" className="acta-card">
              <Text variant="header-1" className="acta-title">{cat.title}</Text>
              <Text variant="body-2" color="secondary" className="acta-desc">{cat.desc}</Text>
              <Button view="action" width="max" onClick={() => window.open(cat.link, '_blank')}>
                CONSULTAR <Icon data={ArrowUpRightFromSquare} size={16} style={{ marginLeft: 8 }} />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
