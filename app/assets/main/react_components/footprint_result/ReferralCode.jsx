import React, { useState } from 'react';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
     
/**
 * React component for referral code field in signup
 */
const ReferralCode = ({ text }) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [inputCode, setInputCode] = useState("");

    /**
     * Funktion that sends a POST request to the server on referral code submit
     * and handles error message at invalid code
     */
    function submit() {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const URL = "/referral-codes/lookup";
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
              "X-CSRF-Token": csrfToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"code": inputCode})
          };
          fetch(URL, requestOptions)
          .then((res) => {
            if (res.status === 404) {
                setErrorMessage("That's not right, try again");
            } else {
                setErrorMessage("");
            }
          })
      }
    
    return (
        <div className="mt-3 collapse">
            <input type="checkbox" id="enter_referral_code" data-target="registrations--referral-code.formPresentedCheckbox" className="hidden"/>
            <div data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden">
                <p className="text-center text-sm">{text.referral_code}
                    <strong data-target="registrations--referral-code.activeCode" className="mr-1"></strong>
                    <label htmlFor="enter_referral_code" className="link cursor-pointer">{text.referral_code_change}</label>
                </p>
            </div>
            <div data-target="registrations--referral-code.noCodeActiveInfo" data-inactive-class="hidden">
                <p className="text-center text-sm">
                    <label htmlFor="enter_referral_code" className="link cursor-pointer">{text.referral_code_link}</label>
                </p>
            </div>
            <div className="collapse-content mt-3">
                <div className="flex">
                    <input size="auto" className="input w-full flex-grow mr-2" placeholder={text.referral_code} 
                        type="text" name="code" id="code" onChange={e => setInputCode(e.target.value)}/> 
                    <AnswerButton label={"OK"} onAnswerGiven={submit}/> 
                </div>
                <p className="text-orange-shade-1 mt-1">{errorMessage}</p>
            </div> 
        </div>
    )
}

export default ReferralCode;
