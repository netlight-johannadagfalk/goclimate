import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { useTexts } from '../context/Footprint/TextsContext.js';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';
import MembershipSelector from '../footprint_result/MembershipSelector.jsx';
import Payment from '../footprint_result/Payment.jsx';
import SignUpContainer from '../footprint_result/SignUpContainer.jsx';
import AnswerButton from './AnswerButton.jsx';
import CategoryPage from './CategoryPage.jsx';
import WorldPage from './WorldPage.jsx';

/**
 * Container for FootprintForm page that is related to results
 * If the page number is 0, then the first page, i.e. WorldComparison, should be visible
 * AnswerButton is used to increase currentIndex and with this the page number
 */
const ResultPage = ({ result, page, onPageChange }) => {
  const [selectedMembership, setSelectedMembership] = useState('single');
  const [multipleOffsets, setMultipleOffsets] = useState(2);
  const [grantedReferralCode, setGrantedReferralCode] = useState(false);

  const footprint = result.footprint;
  const countryAverage = result.country_average;
  const stripePromise = loadStripe('pk_test_4QHSdRjQiwkzokPPCiK33eOq');
  const { slug } = useLocaleData();
  const {
    registrationsText: { continue_to_payment, accept_policies },
    lifestyleFootprintsText: { next },
  } = useTexts();

  return (
    <div>
      <div className='my-8'>
        {page === 0 ? (
          <WorldPage footprint={footprint} countryAverage={countryAverage} />
        ) : page === 1 ? (
          <CategoryPage footprint={footprint} />
        ) : (
          <Elements stripe={stripePromise} options={{ locale: slug }}>
            <SignUpContainer
              selectedMembership={selectedMembership}
              multipleOffsets={multipleOffsets}
              grantedReferralCode={grantedReferralCode}
              price={result.plan.price}
            >
              {page === 2 ? (
                <MembershipSelector
                  selectedMembership={selectedMembership}
                  setSelectedMembership={setSelectedMembership}
                  multipleOffsets={multipleOffsets}
                  setMultipleOffsets={setMultipleOffsets}
                  setGrantedReferralCode={setGrantedReferralCode}
                  grantedReferralCode={grantedReferralCode}
                ></MembershipSelector>
              ) : (
                <Payment selectedMembership={selectedMembership} />
              )}
            </SignUpContainer>
          </Elements>
        )}
      </div>
      <AnswerButton
        label={page !== 2 ? next + ' ->' : continue_to_payment}
        onAnswerGiven={onPageChange}
        stylingClasses={'w-2/3 ' + (page === 2 && 'button-cta')}
      />
      {page === 3 && (
        <div
          className={'inject-link pt-4'}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(accept_policies),
          }}
        ></div>
      )}
    </div>
  );
};

export default ResultPage;
