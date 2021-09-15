import React, { useEffect, useState } from 'react';
import { useLocaleData } from '../context/Footprint/LocaleContext.js';
import { useTexts } from '../context/Footprint/TextsContext.js';
import ConfirmSignUpContainer from '../footprint_result/ConfirmSignUpContainer.jsx';
import SignUpContainer from '../footprint_result/SignUpContainer.jsx';
import AnswerButton from './AnswerButton.jsx';
import CategoryPage from './CategoryPage.jsx';
import WorldPage from './WorldPage.jsx';

const ResultPage = ({ result, page, onPageChange }) => {
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

  const footprint = result.footprint;
  const countryAverage = result.country_average;

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
    <div>
      <div className="my-8">
        {page === 0 ? (
          <WorldPage footprint={footprint} countryAverage={countryAverage} />
        ) : page === 1 ? (
          <CategoryPage footprint={footprint} />
        ) : page === 2 ? (
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
            lifestyleFootprint={footprint.key}
            grantedReferralCode={grantedReferralCode}
            multipleOffsets={multipleOffsets}
            price={price}
          />
        )}
      </div>
      {page !== 3 && (
        <AnswerButton
          label={page === 2 ? continue_to_payment : page === 3 ? start_subscription : next }
          onAnswerGiven={onPageChange}
          stylingClasses={"w-2/3 " + ((page === 2 || page === 3) && "button-cta")}        />
      )}
    </div>
  );
};

export default ResultPage;
