import React from 'react'

/**
 * Shows co2e footprint result using a colored bar, title (with an optional icon) and value tag
 */
const ResultBar = ({ title, width, value, color = "bg-primary", fontWeight = "", spaceStyling = "" }) => {

    return (
        <div className={spaceStyling}>
            <div>
                {title.icon && <i className={"fas fa-fw m-lg:fa-lg " + title.icon} aria-hidden="true"></i>}
                <span className={fontWeight}>{title.text}</span>
            </div>
            <div className="flex-1 pr-24">
                <div className={"relative h-5 m-lg:h-6 " + (width > 0 ? "box-content pr-2" : "")} style={{width: width + "%"}}>
                    {width > 0 && <div className={"w-full h-full rounded-r " + color}></div>}
                    <span className="absolute left-100 top-1/2 w-24 transform -translate-y-1/2 leading-none">
                        <span className="font-bold">{value}</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ResultBar
