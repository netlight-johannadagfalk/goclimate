import React from 'react';
import { useTexts } from '../../../../../../../../../../../../contexts/TextsContext.js';
import PriceTextV2 from '../../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './MembershipDropdown.jsx';

const MembershipAlternativeV2Mobile = ({
  selectedMembership,
  setSelectedMembership,
  type,
  multipleOffsets,
  setMultipleOffsets,
  grantedReferralCode,
  price,
  style,
}) => {
  const {
    reactContentText: {
      memberships_v2: {
        mobile: {
          [type]: { title, selling_point },
        },
      },
    },
  } = useTexts();

  var sellingPoint = selling_point;
  if (type === 'multi') {
    sellingPoint = selling_point.replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  return (
    <>
      <div className={style + 'p-2'}>
        <label htmlFor={type}>
          <div className="m-2">
            <div className="text-center font-bold">
              <span>{title}</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-sm mt-2 mb-4 px-1">
              {sellingPoint}
            </span>
            <br></br>
            {type == 'multi' ? (
              <div className="my-1 grid grid-flow-col justify-items-stretch self-center">
                <div className="justify-self-end my-2">
                  <MembershipDropdown
                    multipleOffsets={multipleOffsets}
                    setMultipleOffsets={setMultipleOffsets}
                  />
                </div>
                <div className="justify-self-start self-center m-4 pl-4 p-1">
                  <PriceTextV2
                    price={price}
                    grantedReferralCode={grantedReferralCode}
                    selectedMembership={type}
                  />
                </div>
              </div>
            ) : (
              <div className="m-4">
                <PriceTextV2
                  price={price}
                  grantedReferralCode={grantedReferralCode}
                  selectedMembership={type}
                />
              </div>
            )}
            <input
              className="width: 1em"
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
