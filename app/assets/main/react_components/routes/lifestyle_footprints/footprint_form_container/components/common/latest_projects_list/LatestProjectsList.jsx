import React from 'react';
import { useProjects } from '../../../../contexts/ProjectsContext.js';
import { useTexts } from '../../../../contexts/TextsContext.js';
import ProjectSummary from './components/ProjectSummary.jsx';

const LatestProjectsList = () => {
  const {
    registrationsText: { latest_projects },
  } = useTexts();
  const projects = useProjects();

  return (
    <div className="my-20 space-y-3">
      <h3 className="heading">{latest_projects}</h3>
      <div className="mt-12 flex flex-col mx-0 t:flex-row m-2">
        {projects.map((project) => (
          <ProjectSummary key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default LatestProjectsList;
