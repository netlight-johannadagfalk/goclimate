import React from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';

const PriceTextV2 = ({ grantedReferralCode, selectedMembership, price }) => {
  const {
    commonText: {
      months: { one },
    },
    registrationsText: { first_month_free, then, price_free },
  } = useTexts();

  return (
    <div className="max-w-full self-center text-center w-1/3 md:w-full">
      {grantedReferralCode !== '' && selectedMembership !== 'free' ? (
        <div id="freeMonth" className="py-6 space-y-1">
          <p className="text-base font-bold text-center">
            <span>{first_month_free}</span>
          </p>
          <p className="font-bold text-center text-sm">
            {then} <span>{price}</span>/{one}
          </p>
        </div>
      ) : (
        <div id="showPrice" className="md:mt-6 lg:mt-0 md:py-6 md:pb-4 md:space-y-1">
          <div className="text-base font-bold md:text-center">
            <span>
              {selectedMembership === 'free' ? (
                <span className="inline">{price_free}</span>
              ) : (
                <div className="lg:h-3">
                  <span>{price}</span><br className="hidden-on-desktop"></br>/{one}
                </div>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTextV2;
