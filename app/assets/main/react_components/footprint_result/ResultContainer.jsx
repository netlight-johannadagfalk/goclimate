import React from 'react';

/**
 * React container for Result page components
 */
const ResultContainer = () => {
console.log("HAHAHAHAHAHA")
    return (
        <div className="pr-16">
            
            <div className="relative pb-1">
                <div className="space-y-6">
                aöoskdjfhöljkdnföajlsndflkasndföaslfjnasödjfnasdkönfljasdnfjlansdfjln
                <div className="callout max-w-md mx-auto" data-controller="registrations--form registrations--membership-choice">
  <a id="sign-up" className="absolute -mt-32"></a>
  <div className="space-y-3" data-controller="registrations--price registrations--referral-code" data-target="registrations--membership-choice.priceControllerElement">
    <h2 className="text-lg d:text-xl font-semibold text-center">
        Sign up now! If we all contribute we can reach the goal together!
    </h2>
    <p className="text-sm text-center mb-6 hidden">Step 1/2</p>
    <p className="text-center">Sign up to save your result, get support in reducing your footprint, and opt in to carbon offset.</p>
    <input type="checkbox" id="step-one-done" className="toggler"/>

    <div className="toggler-checked:hidden">
      <div className="space-y-3">
        <div className="h-px w-full bg-gray-tint-2 hidden"></div>
        <form className="space-y-3" data-target="registrations--price.peopleForm" data-url="/users/sign_up" action="/users/sign_up" accept-charset="UTF-8" method="get">
          <input value="b3ec26a402c164dd2f8a78bf7e95841922cbb9bc" type="hidden" name="lifestyle_footprint" id="lifestyle_footprint"/>
          <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" htmlFor="free">
            <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="free" value="free" data-target="registrations--membership-choice.choice" data-action="click->registrations--membership-choice#handleChange"/>
            <span><span className="font-bold">Free account</span>. Track your carbon footprint over time.</span>
          </label>
          <label className="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" htmlFor="single">
            <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="single" value="single" checked="" data-target="registrations--membership-choice.choice" data-action="click->registrations--membership-choice#handleChange"/>
            <span><span className="font-bold">Offset</span> your carbon footprint through climate projects.</span>
          </label>
            <label className="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" data-active-class="flex flex-row items-center p-3 bg-green-tint-1 rounded cursor-pointer" data-inactive-class="flex flex-row items-center p-3 bg-gray-pastel rounded cursor-pointer" htmlFor="multi">
            <input className="flex-shrink-0 mr-2" type="radio" name="membership" id="multi" value="multi" data-target="registrations--membership-choice.choice" data-action="click->registrations--membership-choice#handleChange"/>
            <span><span className="font-bold">Offset multiple times</span>. Offset more for yourself or for loved ones.</span>
            <div className="select-wrapper flex-shrink-0">
                <select className="select" data-action="change->registrations--membership-choice#chooseMulti" name="people" id="people"S><option selected="selected" value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                </select>
            </div>
        </label>
        </form>        <div className="h-px w-full bg-gray-tint-2 hidden"></div>

        <div data-target="registrations--membership-choice.subscriptionInfo" data-inactive-class="hidden">
          <div className="mt-3 collapse">
            <input type="checkbox" id="enter_referral_code" data-target="registrations--referral-code.formPresentedCheckbox" className="hidden"/>
            <div data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden">
              <p className="text-center text-sm">Referral code: <strong data-target="registrations--referral-code.activeCode" className="mr-1"></strong> <label for="enter_referral_code" className="link cursor-pointer">Change</label></p>
            </div>
            <div data-target="registrations--referral-code.noCodeActiveInfo" data-inactive-class="hidden">
              <p className="text-center text-sm"><label htmlFor="enter_referral_code" className="link cursor-pointer">Have a referral code?</label></p>
            </div>
            <form className="collapse-content mt-3" data-target="registrations--referral-code.form" data-action="registrations--referral-code#submit" action="/referral-codes/lookup" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="QSf6Ic8fXagDW2T7YQ73TB3rgHeNdUfQh7kVSb0XOM+onZmWWWqcfOe0kCvf10S/FXZE5M/+CXu2qYazqz8kYQ=="/>
              <div className="flex">
                <input size="auto" className="input w-full flex-grow mr-2" placeholder="Referral code" type="text" name="code" id="code"/>
                <input type="submit" name="commit" value="OK" className="button"/>
              </div>
              <p className="text-orange-shade-1 mt-1" data-target="registrations--referral-code.errorMessage"></p>
            </form>          
        </div>

          <div className="py-6 space-y-1">
            <p className="heading-lg text-center">
              <span data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden">First month free</span>
              <span data-target="registrations--referral-code.noCodeActiveInfo" data-inactive-class="hidden"><span data-target="registrations--price.price">€7</span>/month</span>
            </p>
            <p data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden" data-active-class="font-bold text-center">
              Then <span data-target="registrations--price.price">€7</span>/month
            </p>

            <p className="text-center text-sm">
              <a href="#where-does-the-money-go" className="link inline" data-controller="scroll-to" data-action="scroll-to#scroll">Where does the money go?</a>
            </p>
          </div>
        </div>
        <div className="hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-inactive-class="hidden">
          <div className="py-6 space-y-1">
            <p className="heading-lg text-center">
              <span className="hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-active-class="inline" data-inactive-class="hidden">Free</span>
            </p>
          </div>
        </div>

        <label htmlFor="step-one-done" id="continue-to-payment" className="button button-cta w-full">
          <span data-target="registrations--membership-choice.subscriptionInfo" data-active-class="inline" data-inactive-class="hidden">Continue to payment</span>
          <span className="hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-active-class="inline" data-inactive-class="hidden">Continue</span>
        </label>
        <p className="text-sm text-right">Step 1/2</p>
      </div>
    </div>

    <div className="toggler-not-checked:hidden">
      <p className="text-sm text-center mb-6 hidden">Step 2/2</p>

    <form data-target="registrations--form.form" action="/users.json" accept-charset="UTF-8" method="post">
        <input type="hidden" name="authenticity_token" value="QSf6Ic8fXagDW2T7YQ73TB3rgHeNdUfQh7kVSb0XOM+onZmWWWqcfOe0kCvf10S/FXZE5M/+CXu2qYazqz8kYQ=="/>
        <input value="b3ec26a402c164dd2f8a78bf7e95841922cbb9bc" type="hidden" name="lifestyle_footprint" id="lifestyle_footprint"/>
        <input value="1" data-target="registrations--price.peopleField" type="hidden" name="people" id="people"/>
        <input data-target="registrations--referral-code.activeCodeField" type="hidden" name="referral_code" id="referral_code"/>
        <input value="" data-target="registrations--membership-choice.membershipField" type="hidden" name="membership" id="membership"/>
        
          <input type="hidden" value="eu" name="user[region]" id="user_region"/>

          <label htmlFor="email" className="block font-semibold">Email</label>
          <input required="required" id="email" className="input w-full" type="email" value="" name="user[email]"/>

          <label htmlFor="password" className="block font-semibold mt-3">Password</label>
          <input required="required" minlength="6" maxlength="128" size="auto" autocomplete="off" id="password" className="input w-full" type="password" name="user[password]"/>

          <div className="mt-3" data-controller="stripe-card-element" data-target="registrations--form.stripeCardElement registrations--membership-choice.stripeCardElement" data-active-class="mt-3 block" data-inactive-class="hidden">
            <label htmlFor="card" className=" font-semibold">Credit or debit card</label>
            <div className="">
              <div id="card" className="input mb-1 StripeElement StripeElement--empty" data-target="stripe-card-element.container"><div className="__PrivateStripeElement" style={{marginRight: 'em'}} >
                  <iframe name="__privateStripeFrame8565" frameborder="0" allowtransparency="true" scrolling="no" allow="payment *" 
                    src="https://js.stripe.com/v3/elements-inner-card-28d1a5db68bc8cd3492fc1f7b0717035.html#locale=en&amp;wait=false&amp;hidePostalCode=true&amp;style[base][fontSize]=16px&amp;style[base][color]=%231C4637&amp;style[base][lineHeight]=24px&amp;style[base][fontWeight]=300&amp;style[invalid][color]=%23994323&amp;rtl=false&amp;componentName=card&amp;keyMode=test&amp;apiKey=pk_test_a1OlA12lwmhYeYTK77LvdqIe&amp;referrer=http%3A%2F%2Flocalhost%3A3000%2Fusers%2Fsign_up%3Flifestyle_footprint%3Db3ec26a402c164dd2f8a78bf7e95841922cbb9bc&amp;controllerId=__privateStripeController8561" 
                    title="Secure card payment input frame" style={{marginRight: 'em'}}>
                    </iframe>
              <input className="__PrivateStripeElement-input" aria-hidden="true" aria-label=" " autocomplete="false" maxlength="1" style={{marginRight: 'em'}} />
              </div></div>
              <div className="text-orange-shade-1" data-target="stripe-card-element.errors"></div>
              <i className="fas fa-lock" aria-hidden="true"></i> <span className="ml-1">Secured by Stripe</span>
              <input data-target="stripe-card-element.paymentMethodField" type="hidden" name="payment_method_id" id="payment_method_id"/>
            </div>
          </div>
    </form>

      <div data-target="registrations--membership-choice.subscriptionInfo" data-inactive-class="hidden">
        <div className="py-6 space-y-1">
          <p className="heading-lg text-center">
            <span data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden">First month free</span>
            <span data-target="registrations--referral-code.noCodeActiveInfo" data-inactive-class="hidden"><span data-target="registrations--price.price">€7</span>/month</span>
          </p>
          <p data-target="registrations--referral-code.codeActiveInfo" className="hidden" data-inactive-class="hidden" data-active-class="font-bold text-center">
            Then <span data-target="registrations--price.price">€7</span>/month
          </p>

          <p className="text-center text-sm">
            <a href="#where-does-the-money-go" className="link inline" data-controller="scroll-to" data-action="scroll-to#scroll">Where does the money go?</a>
          </p>
        </div>
      </div>
        <div className="hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-inactive-class="hidden">
          <div className="py-6 space-y-1">
            <p className="heading-lg text-center">
              <span className="hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-active-class="inline" data-inactive-class="hidden">Free</span>
            </p>
          </div>
        </div>

      <button className="button button-cta w-full" data-target="registrations--membership-choice.subscriptionInfo" data-action="registrations--form#submitWithCardDetails" data-active-class="button button-cta w-full block" data-inactive-class="hidden">
        <i className="fas fa-spinner fa-spin hidden" data-target="registrations--form.loadingIndicator"></i>
        <span>Start subscription</span>
      </button>

      <button className="button button-cta w-full hidden" data-target="registrations--membership-choice.noSubscriptionInfo" data-action="registrations--form#submit" data-active-class="button button-cta block w-full" data-inactive-class="hidden">
        <i className="fas fa-spinner fa-spin hidden" data-target="registrations--form.loadingIndicator"></i>
        <span>Create account</span>
      </button>
      <p className="mt-3 text-sm text-center text-gray-shade-2">
        By signing up you accept the <a href="/privacy-policy" className="link" target="_blank">terms of use and policies</a>
      </p>
      <p className="text-orange-shade-1 ml-4" data-target="registrations--form.errorMessage"></p>
      <div className="mt-3 flex justify-between">
        <div><label htmlFor="step-one-done" className="link-ui text-sm">&lt;- Back</label></div>
        <span className="text-sm">Step 2/2</span>
      </div>
    </div>
  </div>  
</div>
                   


             
                </div>
            </div>
        </div>
    )
}

export default ResultContainer;
