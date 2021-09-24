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
    <div className="justify-self-end t:w-full">
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
        <div id="showPrice" className="t:mt-6 d:mt-0 t:py-6 t:pb-4 t:space-y-1">
          <div className="text-base font-bold t:text-center">
            <span>
              {selectedMembership === 'free' ? (
                <span className="show-on-desktop d:inline">{price_free}</span>
              ) : (
                <div className="d:h-3">
                  <span>{price}</span>
                  <br className="hidden-on-desktop"></br>/{one}
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
