import React from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';

const PriceTextV2 = ({
  grantedReferralCode,
  selectedMembership,
  price,
  style = 'mt-2 mb-1',
  textStyle = '',
  forMobileLayout = false
}) => {
  const {
    commonText: {
      months: { one }
    },
    registrationsText: { first_month_free, then, price_free }
  } = useTexts();

  return (
    <div className={'justify-self-end t:w-full ' + style}>
      {grantedReferralCode !== '' && selectedMembership !== 'free' ? (
        <div
          id="freeMonth"
          className={
            'font-bold text-sm ' +
            (!forMobileLayout
              ? 'text-center space-y-1 pb-1'
              : 'w-max ml-auto pb-2')
          }
        >
          {first_month_free}
          <br />
          {then} {price}/{one}
        </div>
      ) : (
        <div id="showPrice" className="mb-2 t:mb-0 d:mb-2">
          <div className={'font-bold t:text-center ' + textStyle}>
            <span>
              {selectedMembership === 'free' ? (
                <span className="show-on-desktop d:inline">{price_free}</span>
              ) : (
                <div>
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
