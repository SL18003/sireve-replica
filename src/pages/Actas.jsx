import { useState, useEffect } from 'react';
import { Text, Card, Button, Skeleton } from '@gravity-ui/uikit';
import { Folder } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Actas.css';

const actasCategories = [
  {
    title: 'CONSEJO DIRECTIVO CONREVE',
    desc: 'Actas del comité directivo, órgano propositivo del CONREVE, encargado de formular los planes y proyectos.',
  },
  {
    title: 'FICCUA',
    desc: 'Detalles de los Congresos Pre FICCUA, enmarcados en la organización previa al evento de Cultura y Arte del CSUCA.',
  },
  {
    title: 'JUDUCA',
    desc: 'Detalles de los Congresos Pre JUDUCA, enmarcados en la organización previa al evento deportivo del CSUCA.',
  },
  {
    title: 'PROMOTORAS DE LA SALUD',
    desc: 'Acuerdos de las Asambleas General de delegados que promueven el programa de Universidades Promotoras de la Salud.',
  },
  {
    title: 'SESIONES CONREVE',
    desc: 'El CONREVE se reúne ordinariamente dos veces por año y extraordinariamente cuando lo decidan sus miembros.',
  },
];

export default function Actas() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-wrap">
      <PageHeader
        title="Actas SIREVE"
        subtitle="Documentos oficiales de las sesiones y actividades del CONREVE"
        icon={Folder}
      />
      <div className="page-body">
        <div className="actas-grid">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} view="raised" className="actas-card actas-card--skeleton">
                <Skeleton style={{ height: 24, width: '75%', borderRadius: 6 }} />
                <Skeleton style={{ height: 48, width: '100%', borderRadius: 6, marginTop: 12 }} />
                <div className="actas-card-spacer" />
                <Skeleton style={{ height: 36, width: '100%', borderRadius: 8 }} />
              </Card>
            ))
          ) : (
            actasCategories.map((category) => (
              <Card key={category.title} view="raised" className="actas-card">
                <Text variant="header-1" as="h3" className="actas-card-title">{category.title}</Text>
                <Text variant="body-2" color="secondary" className="actas-card-desc">{category.desc}</Text>
                <div className="actas-card-spacer" />
                <Button view="action" width="max" className="actas-card-btn">Consultar</Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
