import React from 'react';
import { useLocaleData } from '../../../../../../../../../../../contexts/LocaleContext.js';
import PriceTextV2 from '../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './components/MembershipDropdown.jsx';
import { calculatePrice } from '../../../../../../../../../../../helpers/result-helper.js';

const MembershipAlternativeV2 = ({
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
  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency },
      },
    },
  } = useLocaleData();

  const style =
    'rounded content-between relative lg:w-1/3 m-1 border border-green-accent ' +
    (type === selectedMembership ? 'bg-green-tint-1 border-2 ' : '');

  for (var point in sellingPoints) {
    sellingPoints[point] = sellingPoints[point].replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  const price = calculatePrice(
    result.plan.price,
    currency,
    false,
    type,
    multipleOffsets
  );

  return (
    <div className={style}>
      <label htmlFor={type}>
        <div className="h-full m-2 cursor-pointer pb-6">
          <div className="h-4 my-2 text-center font-bold">
            <span>{title}</span>
          </div>
          <br></br>
          <PriceTextV2
            price={price}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={type}
          />
          <div className="pl-6">
            <ul className="list-disc">
              {Object.keys(sellingPoints).map((point) => (
                <li className="lg:my-3 text-sm text-left" key={point}>
                  {sellingPoints[point]}
                </li>
              ))}
            </ul>
          </div>
          {type == 'multi' && (
            <div className="align-center align-bottom w-full">
              <MembershipDropdown
                multipleOffsets={multipleOffsets}
                setMultipleOffsets={(dropdownValue) => {
                  setSelectedMembership(type);
                  setMultipleOffsets(dropdownValue);
                }}
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

export default MembershipAlternativeV2;
