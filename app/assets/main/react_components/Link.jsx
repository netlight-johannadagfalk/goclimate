import React from 'react'

const Link = ({ style, link, linkText, onClick }) => {
    return (
        <div className={style}>
            <a className="link" target="_blank" href={link} onClick={onClick}>
                {linkText}
            </a>
        </div>
    )
}

export default Link

