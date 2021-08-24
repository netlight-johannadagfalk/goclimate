import React from 'react'

/**
 * Displays all current GoClimate projects
 */
const LatestProjectsList = ({ latestProjectsText, projects }) => {
    return (
        <div className="m-lg:w-1/2 space-y-3">
            <h3 className="font-semibold">{latestProjectsText}</h3>
            <ul className="space-y-3">
                {
                    projects.map(project => (
                        <li key={project.name} className="flex items-center p-3 bg-white rounded border border-gray-tint-2">
                            <div className="mr-4">
                                <div className="rounded-full overflow-hidden bg-cover bg-center w-12 h-12" style={{backgroundImage: `url(${project.image_url})`}}/>
                            </div>
                            <span>
                                <p className="font-semibold">{project.name}</p>
                                <p>{project.country}</p>
                            </span>
                        </li>
                    ))
                }
            </ul>
      </div>
    )
}

export default LatestProjectsList
