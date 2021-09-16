import React from 'react';
import Link from '../Link.jsx';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useVersion } from '../context/Footprint/VersionContext.js';

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

  const version = useVersion();

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
          {selectedMembership !== 'free' && version === 'v1' && (
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
