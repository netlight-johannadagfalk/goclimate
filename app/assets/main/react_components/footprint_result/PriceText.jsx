import React from 'react'

/**
 * Title used on footprint result page
 */
const PriceText = ({price}) => {

  function extractPrice (price) {

    console.log((Number.isInteger(price.subunit_amount/100)))
    if (Number.isInteger(price.subunit_amount/100)) {
      return (price.subunit_amount/100)
    } else {
      return (price.subunit_amount/100)
    }

    // def to_s(precision: nil) # rubocop:disable Metrics/MethodLength TODO: This needs simplifying
    //   formatting_options = { format: '%n' }
    //   unless precision.nil?
    //     formatting_options[:precision] =
    //       if precision == :auto
    //         subunit_amount % 100 == 0 ? 0 : 2
    //       else
    //         precision
    //       end
    //   end
    //   formatted_number = ActiveSupport::NumberHelper.number_to_currency(amount, formatting_options)

    //   localized_string = I18n.t(
    //     "models.money.currency_formats.#{currency.iso_code}",
    //     number: formatted_number, default: 'DEFAULT', fallback: false
    //   )

    //   if localized_string == 'DEFAULT'
    //     "#{currency} #{formatted_number}"
    //   else
    //     localized_string
    //   end
    // end
  }
    
    return (
        <div className="py-6 space-y-1">
            <p className="heading-lg text-center">
              <span className="hidden">First month free</span>
              <span><span>€7--- {extractPrice (price)}  </span>/month</span>
              {/* @plan.price.to_s(precision: :auto) */}
            </p>
            <p className="hidden">
              Then <span>€7</span>/month
            </p>
        </div>
    )
}

export default PriceText;
