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
  style
}) => {
  const {
    reactContentText: {
      sign_up_page: {
        membership_page: {
          memberships_v2: {
            desktop: {
              [type]: { title, selling_points }
            }
          }
        }
      }
    }
  } = useTexts();

  const replaceMultipleOffsetsNumber = (sellingPoints) => {
    var newSellingPoints = sellingPoints;
    for (var point in newSellingPoints) {
      newSellingPoints[point] = newSellingPoints[point].replace(
        /\d+/,
        multipleOffsets.toString()
      );
    }
    return newSellingPoints;
  };

  const sellingPoints = replaceMultipleOffsetsNumber(selling_points);

  return (
    <>
      <div className={style}>
        <label htmlFor={type}>
          <div className="m-2 cursor-pointer pb-14 h-full">
            <div className="h-2/5">
              <div className="h-2/5 d:h-1/3 text-center">
                <span>{title}</span>
              </div>
              <div className="flex flex-wrap mt-2 d:mt-4">
                <PriceTextV2
                  price={price}
                  grantedReferralCode={grantedReferralCode}
                  selectedMembership={type}
                  style={'mt-0 mb-1'}
                />
                {type == 'multi' && (
                  <div className="text-center w-full ">
                    <MembershipDropdown
                      multipleOffsets={multipleOffsets}
                      setMultipleOffsets={(dropdownValue) => {
                        setSelectedMembership(type);
                        setMultipleOffsets(dropdownValue);
                      }}
                      style={'py-0'}
                    />
                  </div>
                )}
              </div>
            </div>
            <div
              className={
                'ml-4 space-y-2 ' +
                (grantedReferralCode !== '' && 'pt-2 t:pt-4')
              }
            >
              <ul className="list-disc pt-4">
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
                  height: '20px',
                  width: '20px'
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
