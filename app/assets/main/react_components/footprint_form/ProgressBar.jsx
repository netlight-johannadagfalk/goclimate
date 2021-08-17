import React  from 'react';

const ProgressBar= ({ questionCategories, activeCategory, activeQuestion }) => {
  const categories = ["home", "utensils", "shopping-bag", "car", "plane"]
  const inactiveCategoryClass = "border-gray-tint-2"
  const activeCategoryClass = "border-green-tint-1 bg-green-tint-1 text-primary"
  const greenDot = "fas text-green-accent"
  const grayDot = "far text-gray-accent"
  let currentClass = ""
  let reachedActiveCategory = false

  return (
  <>
    <div className="flex justify-center space-x-3 m-lg:space-x-6 text-gray-shade-2" >
    {categories.map((category) => {
      activeCategory == category ? currentClass = activeCategoryClass : currentClass = inactiveCategoryClass 
      reachedActiveCategory = reachedActiveCategory
      activeCategory == category ? reachedActiveCategory = true : reachedActiveCategory = reachedActiveCategory
        return (
          <div>
            <div className={"rounded-full w-12 h-12 flex justify-center items-center box-content p-1 mb-2 border " + currentClass}>
              <div className={"fas fa-lg " + "fa-" + category}></div>
            </div>
            {
            <div className="flex justify-center space-x-1 text-gray-shade-2 content-between text-sm text-gray-accent block">
              {!reachedActiveCategory && <div className="text-green-accent block"><i className="fa fa-check-circle"></i></div>}
              {Object.keys(questionCategories).map((question) => 
              {
                if(reachedActiveCategory){
                  if(questionCategories[question] == category){
                    if(question == activeQuestion){
                      return(<i className={"fa-circle text-green-accent text-sm block " + greenDot}/>)
                    }
                    else{
                      return(<i className={"fa-circle text-green-accent text-sm block " + grayDot}/>) 
                    }
                  }
                }
              })}
            </div>
            }
          </div>
        )
    })}
    </div>
  </>
  )
}

export default ProgressBar;
