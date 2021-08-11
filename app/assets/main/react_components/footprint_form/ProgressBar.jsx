import React, { useState }  from 'react';
import AnswerButton from './AnswerButton.jsx';

const ProgressBar= ({ calculator, active_category }) => {
  const categories = ["fa-home", "fa-utensils", "fa-shopping-bag", "fa-car", "fa-plane"]
  const inactiveClass = "mb-2 border border-gray-tint-2 rounded-full w-12 h-12 flex justify-center items-center box-content p-1"
  const activeClass = "mb-2 border border-green-tint-1 bg-green-tint-1 text-primary rounded-full w-12 h-12 flex justify-center items-center box-content p-1"
  let currentClass = inactiveClass
  console.log(calculator)

  return (
  <>
    <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2" >
    {categories.map((category) => {
      active_category == category ? currentClass = activeClass : currentClass = inactiveClass 
        return (
          <div key={category} className={currentClass}>
            <div className={"fas fa-lg " + category}></div>
          </div>
        )
    })}
    </div>
  </>
  )
}

export default ProgressBar;
