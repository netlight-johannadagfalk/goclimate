import React, { useState, useEffect } from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';
import { useLocaleData } from '../../../../../contexts/LocaleContext.js';
import { useVersion } from '../../../../../contexts/VersionContext.js';
import MembershipPage from './components/membership_page/MembershipPage.jsx';
import RegistrationPage from './components/registration_page/RegistrationPage.jsx';
import AnswerButton from '../common/AnswerButton.jsx';
import FormInformationSection from './components/form_information_section/FormInformationSection.jsx';
import Link from '../../../common/Link.jsx';
import { calculatePrice } from '../../../../../helpers/result-helper.js';

const SignUpPage = ({ result, page, onPageChange }) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState('');
  const [price, setPrice] = useState(0);

  const {
    registrationsText: { continue_to_payment },
    lifestyleFootprintsText: { next },
    reactContentText: {
      leave_without_membership: { button_text },
    },
  } = useTexts();

  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency },
      },
    },
    slug,
  } = useLocaleData();

  const version = useVersion();

  useEffect(() => {
    setPrice(
      calculatePrice(
        result.plan.price,
        currency,
        false,
        selectedMembership,
        multipleOffsets
      )
    );
  }, [grantedReferralCode, selectedMembership, multipleOffsets]);

  return (
    <>
      {page === 2 ? (
        <MembershipPage
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          setGrantedReferralCode={setGrantedReferralCode}
          price={price}
          result={result}
        />
      ) : (
        <RegistrationPage
          selectedMembership={selectedMembership}
          lifestyleFootprint={result.footprint.key}
          grantedReferralCode={grantedReferralCode}
          multipleOffsets={multipleOffsets}
          price={price}
        />
      )}
      {page !== 3 && (
        <div className="mt-8">
          <AnswerButton
            label={page === 2 ? continue_to_payment : next}
            onAnswerGiven={onPageChange}
            stylingClasses={'w-2/3 ' + (page === 2 && 'button-cta')}
          />
        </div>
      )}
      {page === 2 && version == 'v2' && (
        <>
          <FormInformationSection
            price={price}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={selectedMembership}
            multipleOffsets={multipleOffsets}
          />
          <AnswerButton
            label={continue_to_payment}
            onAnswerGiven={() => {
              onPageChange();
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
              });
            }}
            stylingClasses={'w-5/6 button-cta'}
          />
          <Link
            style={'text-sm mt-2'}
            linkStyle={'text-green-shade-1'}
            link={slug + '/climate-tips'}
            linkText={button_text}
            target={''}
          />
        </>
      )}
    </>
  );
};

export default SignUpPage;
