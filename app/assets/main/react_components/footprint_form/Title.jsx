import React from 'react';

const Title = ({text, custom_style}) => {
  console.log(custom_style)
  console.log(text)
  const style = "heading my-4 " + ((!(custom_style === undefined)) ? custom_style : "")

  return (
    <h2 className={"heading my-4 " + ((!(custom_style === undefined)) ? custom_style : "")} >{text}</h2>
  )
}

export default Title;
