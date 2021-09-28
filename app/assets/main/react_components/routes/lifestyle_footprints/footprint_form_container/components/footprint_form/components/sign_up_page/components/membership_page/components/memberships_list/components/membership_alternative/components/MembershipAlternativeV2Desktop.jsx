import React from 'react';
import { useTexts } from '../../../../../../../../../../../../contexts/TextsContext.js';
import PriceTextV2 from '../../../../../../../../common/PriceTextV2.jsx';
import MembershipDropdown from './MembershipDropdown.jsx';

const MembershipAlternativeV2Desktop = ({
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
        desktop: {
          [type]: { title, selling_points },
        },
      },
    },
  } = useTexts();

  var sellingPoints = selling_points;
  for (var point in sellingPoints) {
    sellingPoints[point] = sellingPoints[point].replace(
      /\d+/,
      multipleOffsets.toString()
    );
  }

  return (
    <>
      <div className={style}>
        <label htmlFor={type}>
          <div className="m-2 cursor-pointer pb-14 h-full">
            <div className="h-2/5">
              <div className="h-1/3 mt-3 text-center">
                <span>{title}</span>
              </div>
              <div className="h-2/3 content-center flex flex-wrap">
                <PriceTextV2
                  price={price}
                  grantedReferralCode={grantedReferralCode}
                  selectedMembership={type}
                />
                {type == 'multi' && (
                  <div className="text-center w-full ">
                    <MembershipDropdown
                      multipleOffsets={multipleOffsets}
                      setMultipleOffsets={(dropdownValue) => {
                        setSelectedMembership(type);
                        setMultipleOffsets(dropdownValue);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 mt-3 space-y-2">
              <ul className="list-disc">
                {Object.keys(sellingPoints).map((point) => (
                  <li className="text-sm text-left leading-3 mb-2" key={point}>
                    {sellingPoints[point]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center absolute inset-x-0 bottom-0 mb-1">
              <input
                className="flex-shrink-0"
                style={{
                  height: '25px',
                  width: '25px',
                }}
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
