import React, { useEffect, useState } from 'react';
import { useSession } from '../../../../../contexts/SessionContext.js';
import { useTexts } from '../../../../../contexts/TextsContext.js';
import { useVersion } from '../../../../../contexts/VersionContext.js';
import { calculatePrice } from '../../../../../helpers/result-helper.js';
import scrollToTop from '../../../../../helpers/scroll-to-top.js';
import Link from '../../../common/Link.jsx';
import AnswerButton from '../common/AnswerButton.jsx';
import FormInformationSection from './components/form_information_section/FormInformationSection.jsx';
import MembershipPage from './components/membership_page/MembershipPage.jsx';
import RegistrationPage from './components/registration_page/RegistrationPage.jsx';

const SignUpPage = ({ result, page, onPageChange }) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState('');
  const [price, setPrice] = useState(0);

  const {
    registrationsText: { continue_to_payment },
    lifestyleFootprintsText: { next },
    reactContentText: {
      sign_up_page: {
        membership_page: { back_to_homepage },
      },
    },
  } = useTexts();

  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency },
      },
    },
    slug,
  } = useSession();

  const version = useVersion();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      scrollToTop();
    }
  }, [page]);

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
    <div className="my-8">
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
            label={
              page === 2 && selectedMembership !== 'free'
                ? continue_to_payment
                : next
            }
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
            link={slug + '/'}
            linkText={back_to_homepage}
            target={''}
          />
        </>
      )}
    </div>
  );
};

export default SignUpPage;
