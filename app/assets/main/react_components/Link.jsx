import React from 'react'

const Link = ({ link, linkText }) => {
    return (
        <div className="text-sm">
            <a className="link" target="_blank"
                href={link}>
                {linkText}
            </a>
        </div>
    )
}

export default Link

