import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';

const PriceTextV2 = ({ grantedReferralCode, selectedMembership, price }) => {
  const {
    commonText: {
      months: { one },
    },
    registrationsText: { first_month_free, then, price_free },
  } = useTexts();

  return (
    <div className="text-center">
      {grantedReferralCode !== '' && selectedMembership != 'free' ? (
        <div id="freeMonth" className="py-6 space-y-1">
          <p className="text-base font-bold text-center">
            <span>{first_month_free}</span>
          </p>
          <p className="font-bold text-center text-sm">
            {then} <span>{price}</span>/{one}
          </p>
        </div>
      ) : (
        <div id="showPrice" className="lg:py-6 pb-4 space-y-1">
          <div className="text-base font-bold text-center">
            <span>
              {selectedMembership === 'free' ? (
                <span className="inline">{price_free}</span>
              ) : (
                <div className="h-3">
                  <span>{price}</span>/{one}
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
