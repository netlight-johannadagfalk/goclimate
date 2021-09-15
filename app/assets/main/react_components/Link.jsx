import React from 'react';

const Link = ({ style, link, linkText, linkStyle = 'link', onClick }) => {
  return (
    <div className={style}>
      <a
        className={linkStyle}
        target="_blank"
        href={link}
        onClick={onClick}
        rel="noreferrer"
      >
        {linkText}
      </a>
    </div>
  );
};

export default Link;
