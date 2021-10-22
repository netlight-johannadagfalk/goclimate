import React from 'react';
import { useProjects } from '../../../../contexts/ProjectsContext.js';
import { useTexts } from '../../../../contexts/TextsContext.js';
import ProjectSummary from './components/ProjectSummary.jsx';

const LatestProjectsListV2 = () => {
  const {
    registrationsText: { latest_projects }
  } = useTexts();

  const projects = useProjects();

  return (
    <div className="space-y-3">
      <h3 className="heading text-center">{latest_projects}</h3>
      <div className="flex flex-col mx-0 t:flex-row">
        {projects.map((project) => (
          <ProjectSummary key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default LatestProjectsListV2;
