import React, { useState, useEffect } from 'react';
import { useTexts } from '../../../../../contexts/TextsContext.js';
import { useLocaleData } from '../../../../../contexts/LocaleContext.js';
import { useVersion } from '../../../../../contexts/VersionContext.js';
import SignUpContainer from './components/membership/SignUpContainer.jsx';
import ConfirmSignUpContainer from './components/payment/ConfirmSignUpContainer.jsx';
import AnswerButton from '../common/AnswerButton.jsx';
import FormInformationSection from './components/form_information_section/FormInformationSection.jsx';

const SignUpPage = ({ result, page, onPageChange }) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState('');
  const [price, setPrice] = useState(0);

  const {
    registrationsText: { continue_to_payment },
    lifestyleFootprintsText: { next },
  } = useTexts();

  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency },
      },
    },
  } = useLocaleData();

  const version = useVersion();

  const calculatePrice = () => {
    var price = result.plan.price.subunit_amount / 100;
    if (Math.trunc(price) != price) {
      price = price.toFixed(2);
    }
    if (selectedMembership === 'multi') {
      price = price * multipleOffsets;
    }
    if (currency === 'DEFAULT') {
      price = result.plan.price.currency.iso_code.toUpperCase() + ' ' + price;
    } else {
      const findCustomPlacement = /%{.*?}/i;
      price = currency.replace(findCustomPlacement, price);
    }
    return price;
  };

  useEffect(() => {
    setPrice(calculatePrice());
  }, [grantedReferralCode, selectedMembership, multipleOffsets]);

  return (
    <>
      {page === 2 ? (
        <SignUpContainer
          selectedMembership={selectedMembership}
          setSelectedMembership={setSelectedMembership}
          multipleOffsets={multipleOffsets}
          setMultipleOffsets={setMultipleOffsets}
          grantedReferralCode={grantedReferralCode}
          setGrantedReferralCode={setGrantedReferralCode}
          price={price}
        />
      ) : (
        <ConfirmSignUpContainer
          selectedMembership={selectedMembership}
          lifestyleFootprint={result.footprint.key}
          grantedReferralCode={grantedReferralCode}
          multipleOffsets={multipleOffsets}
          price={price}
        />
      )}
      {page !== 3 && (
        <AnswerButton
          label={page === 2 ? continue_to_payment : next}
          onAnswerGiven={onPageChange}
          stylingClasses={'w-2/3 ' + (page === 2 && 'button-cta')}
        />
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
            stylingClasses={'w-2/3 button-cta'}
          />
        </>
      )}
    </>
  );
};

export default SignUpPage;
