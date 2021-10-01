import React, { useEffect, useRef, useState } from 'react';
import { useTexts } from '../../../../../../../../contexts/TextsContext.js';
import AnswerButton from '../../../../../components/common/AnswerButton.jsx';

const ReferralCode = ({ grantedReferralCode, setGrantedReferralCode }) => {
  const [invalidCodeMessage, setInvalidCodeMessage] = useState('');
  const [inputCode, setInputCode] = useState(grantedReferralCode);
  const [showInput, setShowInput] = useState(grantedReferralCode !== '');
  const mounted = useRef(false);

  const {
    registrationsText: {
      referral_code,
      referral_code_link,
      referral_code_change
    }
  } = useTexts();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const lookUpReferralCode = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const URL = '/referral-codes/lookup';
    const requestOptions = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: inputCode })
    };
    fetch(URL, requestOptions)
      .then((res) => {
        if (mounted.current) {
          if (res.status === 404) {
            setGrantedReferralCode('');
            setInvalidCodeMessage("That's not right, try again");
          } else if (res.status === 200) {
            setGrantedReferralCode(inputCode);
            setInvalidCodeMessage('');
          }
        }
      })
      .catch((error) => {
        console.log('Something went wrong, trying again.', error);
      });
  };

  return (
    <div className="mt-3 collapse">
      {grantedReferralCode ? (
        <div>
          <p className="text-center text-sm">
            {referral_code + ':'}
            <strong className="mr-1"> {inputCode}</strong>
            <label
              className="link cursor-pointer"
              onClick={() => {
                setGrantedReferralCode();
                setInputCode('');
              }}
            >
              {referral_code_change}
            </label>
          </p>
        </div>
      ) : (
        <>
          <p className="text-center text-sm">
            <label
              className="link cursor-pointer"
              onClick={() => setShowInput(!showInput)}
            >
              {referral_code_link}
            </label>
          </p>

          {showInput && (
            <div className="mt-3">
              <div>
                <input
                  size="auto"
                  className="input w-1/2 flex-grow mr-2"
                  placeholder={referral_code}
                  type="text"
                  name="code"
                  id="code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && lookUpReferralCode()}
                />
                <AnswerButton label={'OK'} onAnswerGiven={lookUpReferralCode} />
              </div>
              <p className="text-orange-shade-1 mt-1">{invalidCodeMessage}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReferralCode;
