import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const ProgressBar= ({ calculator, active_category }) => {
  const categories = ["home", "utensils", "shopping-bag", "car", "plane", "coffee"]
  const inactiveClass = "border-gray-tint-2"
  const activeClass = "border-green-tint-1 bg-green-tint-1 text-primary"
  let currentClass = ""

  return (
  <>
    <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2" >
    {categories.map((category) => {
      active_category == category ? currentClass = activeClass : currentClass = inactiveClass 
        return (
          <div>
          <div className={"rounded-full w-12 h-12 flex justify-center items-center box-content p-1 mb-2 border " + currentClass}>
            <div className={"fas fa-lg " + "fa-"+category}></div>
          </div>
          <div className="text-sm text-gray-accent block">
            <div className="far fa-circle text-green-accent text-sm text-gray-accent block">
            </div>
          </div>
          </div>
        )
    })}
    </div>
  </>
  )
}

export default ProgressBar;
