# frozen_string_literal: true

module FeatureHelper
  def log_in(user)
    visit '/users/sign_in'
    fill_in 'user_email', with: user.email
    fill_in 'Password', with: user.password
    click_button 'Log In'
  end

  def authorize_3d_secure
    within_frame(find('body > div > iframe[name^=__privateStripeFrame]', wait: 20)) do
      within_frame(find('iframe[id=challengeFrame]', wait: 20)) do
        within_frame(find('iframe.FullscreenFrame', wait: 20)) do
          # For some unknown reason, the Capybara click method does not work
          # within this iframe in Firefox, but evaluating JS that clicks does.
          find('#test-source-authorize-3ds', wait: 20).evaluate_script('this.click()')
        end
      end
    end
  end

  # Stripe custom card field formats card numbers slowly sometimes,
  # causing send_keys with all digits at the same time to enter digits
  # in wrong order. Sending them 1 by 1 seems to work better.
  def send_keys_to_card_field(card_number)
    card_number.each_char { |c| find('input[name=cardnumber]').send_keys(c) }
  end
end
