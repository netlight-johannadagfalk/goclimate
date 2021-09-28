import React from 'react';

const Title = ({text, customStyle = ""}) => {
  return (
    <h2 className={"heading my-4 t:my-8 " + customStyle } >{text}</h2>
  )
}

export default Title;
