import React from 'react';
import { useSession } from '../../../../../../../../../../../contexts/SessionContext.js';
import { calculatePrice } from '../../../../../../../../../../../helpers/result-helper.js';
import MembershipAlternativeV2Desktop from './components/MembershipAlternativeV2Desktop.jsx';
import MembershipAlternativeV2Mobile from './components/MembershipAlternativeV2Mobile.jsx';

const MembershipAlternativeV2 = ({
  selectedMembership,
  setSelectedMembership,
  type,
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
    'my-6 t:my-0 rounded content-between relative m-1 h-full shadow-lg border-2 ' +
    (type === selectedMembership
      ? ' bg-green-tint-1 '
      : ' border-gray-tint-1 ');

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
