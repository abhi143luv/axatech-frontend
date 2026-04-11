import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { ProjectDetailSection } from '../../components/projects';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    api.project(slug)
      .then(setProject)
      .catch((err) => setError(err.message || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [slug]);

  const title = project?.title || 'Project';
  const description =
    project?.description ||
    'Detailed information about this project.';

  return (
    <>
      <PageMeta title={`${title} - Projects - Axatech`} description={description.slice(0, 155)} />

      <ProjectDetailSection project={project} loading={loading} error={error} />
    </>
  );
}
