import React from 'react'

/**
 * Title used on footprint result page
 */
const PriceText = ({price}) => {
    
    return (
        <div className="py-6 space-y-1">
            <p className="heading-lg text-center">
              <span className="hidden">First month free</span>
              <span><span>€7---  </span>/month</span>
              {/* @plan.price.to_s(precision: :auto) */}
            </p>
            <p className="hidden">
              Then <span>€7</span>/month
            </p>
        </div>
    )
}

export default PriceText;
