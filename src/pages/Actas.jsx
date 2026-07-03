import { useState, useEffect } from 'react';
import { Text, Card, Skeleton, Icon } from '@gravity-ui/uikit';
import { Folder, ArrowUpRightFromSquare } from '@gravity-ui/icons';
import PageHeader from '../components/Layout/PageHeader';
import './Actas.css';

const actasCategories = [
  {
    id: 'conreve-directivo',
    title: 'CONSEJO DIRECTIVO CONREVE',
    desc: 'Actas del comité directivo, órgano propositivo del CONREVE, encargado de formular los planes y proyectos.',
    url: 'https://drive.google.com/drive/folders/1lOTQdIyd4qffetTIOtlz5vlaYvx2aE_h',
  },
  {
    id: 'ficcua',
    title: 'FICCUA',
    desc: 'Detalles de los Congresos Pre FICCUA, enmarcados en la organización previa al evento de Cultura y Arte del CSUCA.',
    url: 'https://drive.google.com/drive/folders/1DfOaQ_DFvqHXgVvk5X19PlLu44JK_Hc4',
  },
  {
    id: 'juduca',
    title: 'JUDUCA',
    desc: 'Detalles de los Congresos Pre JUDUCA, enmarcados en la organización previa al evento deportivo del CSUCA.',
    url: 'https://drive.google.com/drive/folders/1Wfw6WwTzJWllWrIAGM6qs_hnoNc3Q35g',
  },
  {
    id: 'promotoras-salud',
    title: 'PROMOTORAS DE LA SALUD',
    desc: 'Acuerdos de las Asambleas General de delegados que promueven el programa de Universidades Promotoras de la Salud.',
    url: 'https://drive.google.com/drive/folders/1-y2M78ic5uRzOBZKeAF08BqGEkYb1E_W',
  },
  {
    id: 'sesiones-conreve',
    title: 'SESIONES CONREVE',
    desc: 'El CONREVE se reúne ordinariamente dos veces por año y extraordinariamente cuando lo decidan sus miembros.',
    url: 'https://drive.google.com/drive/folders/1rx_yImAJi__RcTDTp6Mv61FYJ0hc5h1Q',
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
              <Card key={category.id} view="raised" className="actas-card">
                <div className="actas-card-accent" />
                <div className="actas-card-header">
                  <div className="actas-card-icon-wrap">
                    <Icon data={Folder} size={22} />
                  </div>
                  <Text variant="header-1" as="h3" className="actas-card-title">{category.title}</Text>
                </div>
                <Text variant="body-2" color="secondary" className="actas-card-desc">{category.desc}</Text>
                <div className="actas-card-spacer" />
                <a
                  href={category.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="actas-card-btn"
                >
                  Consultar
                  <Icon data={ArrowUpRightFromSquare} size={14} />
                </a>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
