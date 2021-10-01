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
  style
}) => {
  const {
    reactContentText: {
      sign_up_page: {
        membership_page: {
          memberships_v2: {
            mobile: {
              [type]: { title, selling_point }
            }
          }
        }
      }
    }
  } = useTexts();

  var sellingPoint = selling_point;
  type === 'multi' &&
    (sellingPoint = selling_point.replace(/\d+/, multipleOffsets.toString()));

  return (
    <>
      <div className={style + 'p-2'}>
        <label htmlFor={type}>
          <div className="w-full block m-xs:hidden mb-2">{title}</div>
          <div className="flex flex-col m-xs:flex-row">
            <div className="flex-wrap content-center hidden m-xs:flex pr-0 m-xxs:pr-3">
              <input
                style={{
                  height: '15px',
                  width: '15px'
                }}
                type="radio"
                name="membership_mobile"
                id={type}
                checked={selectedMembership === type}
                value={type}
                onChange={() => setSelectedMembership(type)}
              />
            </div>
            <div className="flex w-full justify-between flex-col m-xs:flex-row">
              <div className="">
                <div className="flex flex-col pr-2 m-xs:pr-0">
                  <div className="mb-2 hidden m-xs:block">{title}</div>
                  <div
                    className={
                      'text-sm ' +
                      (type !== 'free' && 'pr-0 m-xs:pr-2 pb-2 m-xs:pb-0')
                    }
                  >
                    {sellingPoint}
                  </div>
                </div>
              </div>
              {type !== 'free' && (
                <div className="flex flex-wrap content-center pr-0 m-xs:pr-2">
                  <PriceTextV2
                    price={price}
                    grantedReferralCode={grantedReferralCode}
                    selectedMembership={type}
                    textStyle={'text-sm w-auto m-xs:w-max ml-auto'}
                    style="w-full text-right"
                    forMobileLayout={true}
                  />
                  {type === 'multi' && (
                    <div className="w-full text-right">
                      <MembershipDropdown
                        multipleOffsets={multipleOffsets}
                        setMultipleOffsets={(dropdownValue) => {
                          setSelectedMembership(type);
                          setMultipleOffsets(dropdownValue);
                        }}
                        style="py-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </label>
      </div>
    </>
  );
};

export default MembershipAlternativeV2Mobile;
