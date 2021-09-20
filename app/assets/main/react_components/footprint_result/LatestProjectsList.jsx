import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext';
import { useProjects } from '../context/Footprint/ProjectsContext';
import ProjectSummary from './ProjectSummary.jsx';

const LatestProjectsList = () => {
  const {
    registrationsText: { latest_projects },
  } = useTexts();
  const projects = useProjects();

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-semibold">{latest_projects}</h3>
        <div className="mt-12 flex flex-col d:flex-row">
          {projects.map((project) => (
            <ProjectSummary
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default LatestProjectsList;
