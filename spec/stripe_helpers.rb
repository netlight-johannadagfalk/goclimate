# frozen_string_literal: true

module StripeHelpers
  def stripe_json_fixture(fixture_path)
    JSON.parse(file_fixture("stripe/#{fixture_path}").read)
  end

  # Stripe custom card field formats card numbers slowly sometimes,
  # causing send_keys with all digits at the same time to enter digits
  # in wrong order. Sending them 1 by 1 seems to work better.
  def send_keys_to_card_field(card_number)
    card_number.each_char { |c| find('input[name=cardnumber]').send_keys(c) }
  end
end
