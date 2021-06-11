# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StripeExtensions::Plan do
  subject(:plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan.json')) }

  describe '#monthly_amount' do
    it 'returns a corresponding Money' do
      expect(plan.monthly_amount).to eq(Money.new(3_60, :usd))
    end
  end
end
