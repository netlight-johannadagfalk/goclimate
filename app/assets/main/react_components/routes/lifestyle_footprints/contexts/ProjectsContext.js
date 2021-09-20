import React, { useContext } from 'react';

const ProjectsContext = React.createContext(undefined);
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context)
    throw new Error(
      'Please wrap component in ProjectsProvider to use useProjects'
    );
  return context;
};

export const ProjectsProvider = ({ children, projects }) => {
  const allProjects = JSON.parse(projects);

  return (
    <ProjectsContext.Provider value={allProjects}>
      {children}
    </ProjectsContext.Provider>
  );
};
