import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { ProjectsSection } from '../../components/projects';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.projects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Projects - Axatech"
        description="Explore our portfolio projects and case studies."
      />

      <ProjectsSection projects={projects} loading={loading} />
    </>
  );
}
