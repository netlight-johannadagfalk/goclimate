import React, {useState} from 'react';

/**
 * React component for refferal code field in signup
 */
const RefferalCode = () => {
    const [inputValue, setInputValue] = useState("");
    function submit(){
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        const URL = "/referral-codes/lookup";
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
              "X-CSRF-Token": csrfToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"code": inputValue})
          };
          fetch(URL, requestOptions)
      }
    
    return (
        <div className="mt-3 collapse">
            <input type="checkbox" id="enter_referral_code" data-target="registrations--referral-code.formPresentedCheckbox" className="hidden"/>
            <div data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden">
                <p className="text-center text-sm">{/* Add translate functionality here */}Referral code: <strong data-target="registrations--referral-code.activeCode" className="mr-1"></strong> <label for="enter_referral_code" className="link cursor-pointer">{/* Add translate functionality here */}Change</label></p>
            </div>
            <div data-target="registrations--referral-code.noCodeActiveInfo" data-inactive-class="hidden">
                <p className="text-center text-sm"><label htmlFor="enter_referral_code" className="link cursor-pointer">{/* Add translate functionality here */}Have a referral code?</label></p>
            </div>
            <form className="collapse-content mt-3" action="/referral-codes/lookup" accept-charset="UTF-8" method="post" onSubmit={e => { e.preventDefault(); }}
            >
                <div className="flex">
                    <input size="auto" className="input w-full flex-grow mr-2" placeholder="Referral code" type="text" name="code" id="code" onChange={e => setInputValue(e.target.value)}/> 
                    <input type="submit" name="commit" value="OK" className="button" onClick={() => submit()}/> 
                </div>
                <p className="text-orange-shade-1 mt-1" data-target="registrations--referral-code.errorMessage"></p>
            </form> 
        </div>
    )
}

export default RefferalCode;
