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
  const version = useVersion();
  const tabletScrollBreakpoint = 768;

  const {
    registrationsText: { continue_to_payment },
    lifestyleFootprintsText: { next },
    reactContentText: {
      sign_up_page: {
        membership_page: { back_to_homepage }
      }
    }
  } = useTexts();

  const {
    currency: {
      money: {
        currency_formats: { [result.plan.price.currency.iso_code]: currency }
      }
    },
    slug
  } = useSession();

  useEffect(() => {
    if (window.innerWidth <= tabletScrollBreakpoint) {
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
    <div className="space-y-20">
      <div className="space-y-6">
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
          <AnswerButton
            label={
              page === 2 && selectedMembership !== 'free'
                ? continue_to_payment
                : next
            }
            onAnswerGiven={onPageChange}
            stylingClasses={'w-2/3 ' + (page === 2 && 'button-cta')}
          />
        )}
      </div>
      {page === 2 && version == 'v2' && (
        <div className="space-y-8">
          <FormInformationSection
            price={price}
            grantedReferralCode={grantedReferralCode}
            selectedMembership={selectedMembership}
          />
          <div className="space-y-2">
            <AnswerButton
              label={continue_to_payment}
              onAnswerGiven={() => {
                onPageChange();
                scrollToTop();
              }}
              stylingClasses={'w-5/6 button-cta'}
            />
            <Link
              style={'text-sm'}
              linkStyle={'text-green-shade-1'}
              link={slug + '/'}
              linkText={back_to_homepage}
              target={''}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
