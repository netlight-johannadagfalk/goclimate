# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LifestyleChoice do
  describe 'get plan' do
    it 'returns the price plan given a number of lifestyle choices' do
      lc1 = create(:lifestyle_choice)
      lc2 = create(:lifestyle_choice)

      plan = LifestyleChoice.stripe_plan ""
      expect(plan).to eq("x")

      plan = LifestyleChoice.stripe_plan "#{lc1.id}, #{lc2.id}"
      expect(plan).to eq(2.4)
    end
  end
end
