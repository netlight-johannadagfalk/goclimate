import React from 'react';
import { useLocaleData } from '../../../../../../../../../../../contexts/LocaleContext.js';
import { calculatePrice } from '../../../../../../../../../../../helpers/result-helper.js';
import PriceTextV2 from '../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './components/MembershipDropdown.jsx';

const MembershipAlternativeV2Mobile = ({
  selectedMembership,
  setSelectedMembership,
  type,
  mobile,
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
    'rounded content-between relative m-1 border border-green-accent h-full ' +
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
    <>
      <div className="show-on-desktop w-1/3 ">
        <div className={style}>
          <label className={"h-full"} htmlFor={type}>
            <div className="m-2 cursor-pointer pb-6 h-full">
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
      </div>
      <div className="hidden-on-desktop">
        <div className={style}>
          <label htmlFor={type}>
            <div className="h-full flex flex-row m-2 cursor-pointer">
              <div className="w-1/2 h-full">
                <div className="h-4 my-2 text-left font-bold">
                  <span>{mobile.title}</span>
                </div>
                <br></br>
                {type == 'multi' && (
                  <div className="w-full">
                    <MembershipDropdown
                      multipleOffsets={multipleOffsets}
                      setMultipleOffsets={setMultipleOffsets}
                    />
                  </div>
                )}
                <span>{mobile.selling_points}</span>
              </div>
              <br></br>
              <PriceTextV2
                price={price}
                grantedReferralCode={grantedReferralCode}
                selectedMembership={type}
              />
              <input
                className="w-1/6 align-right self-center"
                type="radio"
                name="membership"
                id={type}
                checked={selectedMembership === type}
                value={type}
                onChange={() => setSelectedMembership(type)}
              />
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default MembershipAlternativeV2Mobile;
