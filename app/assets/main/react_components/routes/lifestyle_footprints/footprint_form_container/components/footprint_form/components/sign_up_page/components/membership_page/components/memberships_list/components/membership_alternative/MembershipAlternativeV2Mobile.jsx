import React from 'react';
import PriceTextV2 from '../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './components/MembershipDropdown.jsx';

const MembershipAlternativeV2Mobile = ({
  selectedMembership,
  setSelectedMembership,
  type,
  mobile,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  price,
  style,
}) => {
  if (type === 'multi') {
    mobile.selling_point = mobile.selling_point.replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  return (
    <>
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
              <span>{mobile.selling_point}</span>
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
              name="membership_mobile"
              id={type}
              checked={selectedMembership === type}
              value={type}
              onChange={() => setSelectedMembership(type)}
            />
          </div>
        </label>
      </div>
    </>
  );
};

export default MembershipAlternativeV2Mobile;
