import React, { useState, useEffect } from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';

const ProjectSummary = ({ project }) => {
  const [collapseState, setCollapseState] = useState('hidden');
  const [shortText, setShortText] = useState(false);
  const [tempHeight, setTempHeight] = useState(0.0);

  const {
    sharedText: { read_more },
  } = useTexts();

  useEffect(() => {
    const titleElement = document.getElementById('title' + project.id);
    const descriptionElement = document.getElementById(
      'description' + project.id
    );
    const projectBoxElement = document.getElementById(
      'projectBox' + project.id
    );
    setTempHeight(projectBoxElement?.clientHeight + 3);
    setShortText((titleElement?.scrollHeight + descriptionElement?.scrollHeight < 125));
  }, []);

  return (
    <div className="t:w-1/3 pt-14 t:px-1 self-center t:self-start max-w-sm w-full">
      <div
        id={'projectBox' + project.id}
        className="callout space-y-3 pt-0 p-4 text-left collapse min-h-1/4 w-full"
        style={{ minHeight: +tempHeight + 'px' }}
      >
        <div className="inline-block w-full ">
          <img
            className="mx-auto h-20 w-20 -mt-10 m-lg:h-24 m-lg:w-24 m-lg:-mt-12 rounded-full object-cover"
            src={project.image_url}
          />
        </div>

        <div
          className={collapseState === 'hidden' ? ' fadeProjects w-full' : ''}
        >
          <h3 className="font-semibold" id={'title' + project.id}>
            {project.name}
          </h3>
          <p className="pt-2" id={'description' + project.id}>
            {project.short_description}
          </p>
        </div>
        {!shortText && (
          <div
            className="flex cursor-pointer justify-center"
            onClick={() =>
              setCollapseState(collapseState === 'hidden' ? 'block' : 'hidden')
            }
          >
            <div className="font-semibold">{read_more}</div>
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
        )}
      </div>
    </div>
  );
};

export default ProjectSummary;
