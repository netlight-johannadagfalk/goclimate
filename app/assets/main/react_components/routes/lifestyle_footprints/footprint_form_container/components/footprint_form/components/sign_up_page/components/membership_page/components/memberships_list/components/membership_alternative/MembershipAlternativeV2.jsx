import React from 'react';
import { useSession } from '../../../../../../../../../../../contexts/SessionContext.js';
import { calculatePrice } from '../../../../../../../../../../../helpers/result-helper.js';
import MembershipAlternativeV2Desktop from './MembershipAlternativeV2Desktop.jsx';
import MembershipAlternativeV2Mobile from './MembershipAlternativeV2Mobile.jsx';

const MembershipAlternativeV2 = ({
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
  } = useSession();

  const style =
    'rounded content-between relative m-1 border border-green-accent h-full ' +
    (type === selectedMembership ? 'bg-green-tint-1 border-2 ' : '');

  const price = calculatePrice(
    result.plan.price,
    currency,
    false,
    type,
    multipleOffsets
  );
  return (
    <>
      <div className="show-on-desktop w-1/3">
        <MembershipAlternativeV2Desktop
          price={price}
          style={style}
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type={type}
          title={title}
          sellingPoints={sellingPoints}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
      </div>
      <div className="hidden-on-desktop">
        <MembershipAlternativeV2Mobile
          price={price}
          style={style}
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          type={type}
          mobile={mobile}
          sellingPoints={sellingPoints}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          result={result}
        />
      </div>
    </>
  );
};

export default MembershipAlternativeV2;
