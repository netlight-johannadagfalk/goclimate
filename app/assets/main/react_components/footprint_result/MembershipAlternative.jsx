import React from 'react';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';
import PriceTextV2 from './PriceTextV2.jsx';
import SelectorMultipleTimes from './SelectorMultipleTimes.jsx';

const MembershipAlternative = ({
  selectedMembership,
  setSelectedMembership,
  type,
  title,
  sellingPoints,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  result,
}) => {
  const style =
    'rounded content-between relative lg:w-1/3 cursor-pointer m-1 p-2 border border-green-accent ' +
    (type === selectedMembership ? 'bg-green-tint-1 border-8' : '');

  //PRISET GIVEN ALTERNATIV, variabel per kategori istället för alla har samma
  for (var point in sellingPoints) {
    sellingPoints[point] = sellingPoints[point].replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency },
      },
    },
  } = useLocaleData();

  const calculatePrice = () => {
    var price = result.plan.price.subunit_amount / 100;
    if (Math.trunc(price) != price) {
      price = price.toFixed(2);
    }
    if (type === 'multi') {
      price = price * multipleOffsets;
    }
    if (currency === 'DEFAULT') {
      price = result.plan.price.currency.iso_code.toUpperCase() + ' ' + price;
    } else {
      const findCustomPlacement = /%{.*?}/i;
      price = currency.replace(findCustomPlacement, price);
    }
    return price;
  };

  return (
    <div className={style}>
      <label htmlFor={type}>
        <div className="h-full">
          <div className="h-3 text-center font-bold">
            <span>{title}</span>
          </div>
          <br></br>
          <PriceTextV2
            price={calculatePrice()}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={type}
          />
          <div className="p-6">
            <ul className="list-disc">
              {Object.keys(sellingPoints).map((point) => {
                return (
                  <li className="lg:my-3 text-sm text-left" key={point}>
                    {sellingPoints[point]}
                  </li>
                );
              })}
            </ul>
          </div>
          {type == 'multi' && (
            <div className="align-center align-bottom w-full">
              <SelectorMultipleTimes
                multipleOffsets={multipleOffsets}
                setMultipleOffsets={setMultipleOffsets}
              />
            </div>
          )}
          <div className="text-center absolute inset-x-0 pt-5 bottom-0">
            <input
              className="flex-shrink-0 mr-2 "
              type="radio"
              name="membership"
              id={type}
              checked={selectedMembership === type}
              value={type}
              onChange={() => setSelectedMembership(type)}
            />
          </div>
        </div>
      </label>
    </div>
  );
};

export default MembershipAlternative;
