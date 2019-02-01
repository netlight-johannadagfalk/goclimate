# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LifestyleChoice do
  describe '.stripe_plan' do
    let!(:choice1) { create(:lifestyle_choice) }
    let!(:choice2) { create(:lifestyle_choice) }

    it 'returns x when no plans are specified' do
      plan = described_class.stripe_plan('')

      expect(plan).to eq('x')
    end

    it 'returns the price plan given a number of lifestyle choices' do
      plan = described_class.stripe_plan("#{choice1.id}, #{choice2.id}")
      expect(plan).to eq(2.4)
    end
  end
end
