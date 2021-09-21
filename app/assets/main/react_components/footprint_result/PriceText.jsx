import React from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import Link from '../Link.jsx';

const PriceText = ({ grantedReferralCode, selectedMembership, price }) => {
  const {
    commonText: {
      months: { one },
    },
    registrationsText: {
      first_month_free,
      then,
      price_free,
      where_does_the_money_go: { heading },
    },
  } = useTexts();

  return (
    <div className="text-center">
      {grantedReferralCode !== '' && selectedMembership != 'free' ? (
        <div id="freeMonth" className="py-6 space-y-1">
          <p className="heading-lg text-center">
            <span>{first_month_free}</span>
          </p>
          <p className="font-bold text-center">
            {then} <span>{price}</span>/{one}
          </p>
        </div>
      ) : (
        <div id="showPrice" className="py-6 space-y-1">
          <p className="heading-lg text-center">
            <span>
              {selectedMembership === 'free' ? (
                <span className="inline">{price_free}</span>
              ) : (
                <>
                  <span>{price}</span>/{one}
                </>
              )}
            </span>
          </p>
          {selectedMembership !== 'free' && (
            <Link
              link={'information-scroll-position'}
              linkText={heading}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById('information-scroll-position')
                  .scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PriceText;
