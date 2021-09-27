import React, { useState, useEffect } from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';

const ProjectSummary = ({ project }) => {
  const [collapseState, setCollapseState] = useState('hidden');
  const [shortText, setShortText] = useState(false);
  const [tempHeight, setTempHeight] = useState(0.0);
  const [tempHeight2, setTempHeight2] = useState(0.0);

  
  const {
    sharedText: { read_more },
  } = useTexts();

  const HEJ = (
    <>
      <h3 className="font-semibold" id={"test"+project.id}>      {tempHeight2}
{project.name}</h3>
      <p className="pt-2" id={"testa"+project.id}>{project.short_description}</p>
    </>
  )

  useEffect(() => {
    const element = document.getElementById("test"+project.id)
    console.log(element?.scrollHeight)

    const element2 = document.getElementById("testa"+project.id)
    console.log(element2?.scrollHeight)

    const element3 = document.getElementById("testq"+project.id)
    console.log("q3 ",element3?.scrollHeight)
    setTempHeight(element3?.scrollHeight)

    const element4 = document.getElementById("testr"+project.id)
    console.log("q4 ",element4?.scrollHeight)
    setTempHeight2(element4?.clientHeight)

    console.log("tempHeight", tempHeight);
    console.log("tempHeight2", tempHeight2);

    if (element?.scrollHeight + element2?.scrollHeight < 125) {
      console.log("haj ",element?.scrollHeight + element2?.scrollHeight);
      setShortText(true)
    }
    
  }, []);

  return (
    <div id={"testq"+project.id} className="t:w-1/3 pt-14 t:px-1 self-center t:self-start" >
      <div id={"testr"+project.id} className="callout space-y-3 pt-0 p-4 text-left collapse min-h-1/4 max-w-sm" style={{minHeight: +tempHeight2+3+"px"}}>
        <div className="inline-block w-full ">
          <img
            className="mx-auto h-20 w-20 -mt-10 m-lg:h-24 m-lg:w-24 m-lg:-mt-12 rounded-full object-cover"
            src={project.image_url}
          />
        </div>
        
        <div
          className={collapseState === 'hidden' ? ' fadeProjects w-full' : ''}
        >
          {
            HEJ
          }
        </div>
        { !shortText &&
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
        }
      </div>
    </div>
  );
};

export default ProjectSummary;
