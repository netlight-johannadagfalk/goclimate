import React from 'react'

const ResultLink = ({ link, linkText }) => {
    return (
        <div className="text-sm">
            <a className="link" target="_blank"
                href={link}>
                {linkText}
            </a>
        </div>
    )
}

export default ResultLink

