import React from 'react';

const Link = ({
  style,
  link,
  linkText,
  linkStyle = 'link',
  onClick,
  target = '_blank',
}) => {
  return (
    <div className={style}>
      <a
        className={linkStyle}
        target={target}
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
