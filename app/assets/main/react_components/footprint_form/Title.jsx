import React from 'react';

const Title = ({text, custom_style}) => {
  return (
    <h2 className={"heading my-4 " + (custom_style !== undefined ? custom_style : "")} >{text}</h2>
  )
}

export default Title;
