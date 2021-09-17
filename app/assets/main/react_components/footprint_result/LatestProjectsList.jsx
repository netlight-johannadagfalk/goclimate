import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext';
import { useProjects } from '../context/Footprint/ProjectsContext';

const LatestProjectsList = () => {
  const {
    registrationsText: { latest_projects },
  } = useTexts();
  const projects = useProjects();

  return (
    <>
    <div className="space-y-3 text-left">
      <h3 className="font-semibold">{latest_projects}</h3>
      <div className="mt-12 flex flex-col d:flex-row">

        {projects.map((project) => (
          <>
            <div className="d:w-1/3 pt-20 px-1 m-lg:pt-16">
              <div className="callout h-full space-y-3 pt-0 p-2">
                <div className="inline-block w-full">
                  <img
                    className="mx-auto h-10 w-10 -mt-10 m-lg:h-24 m-lg:w-24 m-lg:-mt-12 rounded-full object-cover"
                    src={project.image_url}
                  />
                </div>
                <h3 className="font-semibold">
                  {project.name}
                </h3>
                <p>
                  {project.short_description}
                </p>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* <li
            key={project.name}
            className="flex items-center p-3 bg-white rounded border border-gray-tint-2"
          >
            <div className="mr-4">
              <div
                className="rounded-full overflow-hidden bg-cover bg-center w-12 h-12"
                style={{ backgroundImage: `url(${project.image_url})` }}
              />
            </div>
            <span>
              <p className="font-semibold">{project.name}</p>
              <p>{project.country}</p>
            </span>
          </li> */}
      {/* <div className="mt-12 flex flex-col d:flex-row section-gutter">

        <div className="d:w-1/3 pt-20 m-lg:pt-24">
          <div className="callout h-full space-y-3 pt-0">
            <div className="inline-block w-full">
              <img
                className="mx-auto h-40 w-40 -mt-20 m-lg:h-48 m-lg:w-48 m-lg:-mt-24 rounded-full object-cover"
                src="https://www.goclimate.com/blog/wp-content/uploads/2017/05/0000213_trang-palm-oil-wastewater-treatment-project-in-trang-province-thailand_550.jpeg"
              />
            </div>
            <h3 className="heading">
              Trang Palm Oil Wastewater Treatment Project in Trang Province
            </h3>
            <p>
              We have now made our third community climate offset, this time in
              Trang Palm Oil Wastewater Treatment Project in Trang Province,
              Thailand.
            </p>
          </div>
        </div>

        <div className="d:w-1/3 pt-20 m-lg:pt-24">
          <div className="callout h-full space-y-3 pt-0">
            <div className="inline-block w-full">
              <img
                className="mx-auto h-40 w-40 -mt-20 m-lg:h-48 m-lg:w-48 m-lg:-mt-24 rounded-full object-cover"
                src="https://www.goclimate.com/blog/wp-content/uploads/2017/05/0000213_trang-palm-oil-wastewater-treatment-project-in-trang-province-thailand_550.jpeg"
              />
            </div>
            <h3 className="heading">
              Trang Palm Oil Wastewater Treatment Project in Trang Province
            </h3>
            <p>
              We have now made our third community climate offset, this time in
              Trang Palm Oil Wastewater Treatment Project in Trang Province,
              Thailand.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  </>
  );
};

export default LatestProjectsList;
