import React from 'react'
import { useTexts, useProjects } from '../context/Footprint/StaticDataContext'
/**
 * Displays all current GoClimate projects
 */
const LatestProjectsList = () => {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold">{useTexts().registrationsText.latest_projects}</h3>
            <ul className="space-y-3">
                {
                    useProjects().map(project => (
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
