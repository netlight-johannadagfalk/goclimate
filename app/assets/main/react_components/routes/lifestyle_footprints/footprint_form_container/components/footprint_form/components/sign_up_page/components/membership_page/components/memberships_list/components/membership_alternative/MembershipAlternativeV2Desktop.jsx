import React from 'react';
import PriceTextV2 from '../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './components/MembershipDropdown.jsx';

const MembershipAlternativeV2Desktop = ({
  selectedMembership,
  setSelectedMembership,
  type,
  title,
  sellingPoints,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  price,
  style,
}) => {
  for (var point in sellingPoints) {
    sellingPoints[point] = sellingPoints[point].replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  return (
    <>
      <div className={style}>
        <label className={'h-full'} htmlFor={type}>
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
                name="membership_desktop"
                id={type}
                checked={selectedMembership === type}
                value={type}
                onChange={() => setSelectedMembership(type)}
              />
            </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default MembershipAlternativeV2Desktop;
