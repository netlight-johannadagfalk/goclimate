import React, { useState } from 'react';

const ProjectSummary = ({ project }) => {
  const [collapseState, setCollapseState] = useState('hidden');

  return (
    <div className="d:w-1/3 pt-20 px-1 m-lg:pt-16">
      <div className="callout space-y-3 pt-0 p-4 text-left collapse min-h-1/4">
        <div className="inline-block w-full ">
          <img
            className="mx-auto h-10 w-10 -mt-10 m-lg:h-24 m-lg:w-24 m-lg:-mt-12 rounded-full object-cover"
            src={project.image_url}
          />
        </div>
        <div className={collapseState === 'hidden'
              ? " fadeProjects w-full"
              : ""}>
            
          <h3 className="font-semibold">{project.name}</h3>
          {/* <p>
            {collapseState === 'hidden'
              ? project.short_description.slice(0, 80) + '...'
              : project.short_description}
          </p> */}
          <p className="pt-2">
            {project.short_description}
          </p>
        </div>

        <div
          className="flex cursor-pointer"
          onClick={() =>
            setCollapseState(collapseState === 'hidden' ? 'block' : 'hidden')
          }
        >
          <div className="font-semibold">Read more</div>
          <div className="pl-1">
            <i
              className={
                'fas fa-chevron-circle-down transition-transform ease-in-out duration-300 ' +
                (collapseState !== 'hidden' && 'transform rotate-180')
              }
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
