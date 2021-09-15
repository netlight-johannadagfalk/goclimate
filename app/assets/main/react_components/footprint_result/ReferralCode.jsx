import React, { useEffect, useRef, useState } from 'react';
import { useTexts } from '../context/Footprint/TextsContext.js';
import AnswerButton from '../footprint_form/AnswerButton.jsx';
     
/**
 * React component for referral code field in signup
 * Shows link and input field
 */
const ReferralCode = ({ grantedReferralCode, setGrantedReferralCode }) => {

    const [invalidCodeMessage, setInvalidCodeMessage] = useState("");
    const [inputCode, setInputCode] = useState("");

    const mounted = useRef(false);

    const { registrationsText: { code, referral_code_link, referral_code_change } } = useTexts()

    /**
     * Function that sends a POST request to the server on referral code submit
     * and handles and message to the user at invalid code
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
                setGrantedReferralCode(false)
                setInvalidCodeMessage("That's not right, try again");
            } else if (res.status === 200) { 
                setGrantedReferralCode(true)
                setInvalidCodeMessage("");
            }
        })
        .catch(error => {    
            console.log("Something went wrong, trying again.", error);
        })
    }

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      }
    }, [])

    return (
        <div className="mt-3 collapse">
            <input type="checkbox" id="enter_referral_code"/>
            { grantedReferralCode ?
                <div>
                    <p className="text-center text-sm">{code}
                        <strong className="mr-1"> {inputCode}</strong>
                        <label className="link cursor-pointer" 
                            onClick={() => {
                                setGrantedReferralCode(false); 
                                setInputCode("")
                            }}
                        >{referral_code_change}</label>
                    </p>
                </div>
                :
                <>
                    <p className="text-center text-sm">
                        <label htmlFor="enter_referral_code" className="link cursor-pointer">{referral_code_link}</label>
                    </p>
                    <div className="collapse-content mt-3">
                        <div className="flex">
                            <input size="auto" className="input w-full flex-grow mr-2" placeholder={code} 
                                type="text" name="code" id="code" value={inputCode} onChange={e => setInputCode(e.target.value)}
                                onKeyPress = {(e) => { 
                                    if (e.key === 'Enter') 
                                        submit();
                                }}
                            /> 
                            <AnswerButton label={"OK"} onAnswerGiven={submit}/>
                        </div>
                        <p className="text-orange-shade-1 mt-1">{invalidCodeMessage}</p>
                    </div> 
                </>
            }
        </div>
    )
}

export default ReferralCode;
