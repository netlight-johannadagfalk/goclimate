# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Subscriptions::Plan do
  describe '.for_footprint' do
    it 'calculates monthly price using doubling buffer' do
      plan = described_class.for_footprint(GreenhouseGases.new(12_000), Currency::SEK)

      expect(plan.price).to eq(Money.new(80_00, :sek))
    end

    it 'ceils SEK prices to nearest 5 SEK' do
      plan = described_class.for_footprint(GreenhouseGases.new(11_400), Currency::SEK)

      expect(plan.price).to eq(Money.new(80_00, :sek))
    end

    it 'rounds USD prices to nearest 50 cents' do
      plan = described_class.for_footprint(GreenhouseGases.new(12_900), Currency::USD)

      expect(plan.price).to eq(Money.new(10_50, :usd))
    end

    it 'rounds EUR prices to nearest 50 cents' do
      plan = described_class.for_footprint(GreenhouseGases.new(15_165), Currency::EUR)

      expect(plan.price).to eq(Money.new(10_50, :eur))
    end
  end

  describe '#retrieve_or_create_climate_offset_plan' do
    subject(:plan) { described_class.for_price(price) }

    let(:price) { Money.from_amount(3.6, Currency::USD) }
    let(:stripe_plan) { Stripe::Plan.construct_from(stripe_json_fixture('plan.json')) }

    before do
      allow(Stripe::Plan).to receive(:retrieve).and_return(stripe_plan)
      allow(Stripe::Plan).to receive(:create).and_return(stripe_plan)
    end

    it 'attempts to retrieve existing stripe_plan' do
      plan.retrieve_or_create_stripe_plan

      expect(Stripe::Plan).to have_received(:retrieve)
    end

    it 'uses stripe_plan id in format "climate_offset_[price]_[currency]_monthly"' do
      plan.retrieve_or_create_stripe_plan

      expect(Stripe::Plan).to have_received(:retrieve).with('climate_offset_3_6_usd_monthly')
    end

    # FIXME: This test is reused and structured based on old code. Left as is as an intermediate step.
    it 'raises argument error when monthly amount is 0' do
      expect do
        described_class.for_price(Money.new(0, :sek)).retrieve_or_create_stripe_plan
      end.to raise_error(ArgumentError)
    end

    context 'when stripe_plan exists' do
      it 'returns retrieved stripe_plan' do
        retrieved_stripe_plan = plan.retrieve_or_create_stripe_plan

        expect(retrieved_stripe_plan).to be(stripe_plan)
      end
    end

    context 'when stripe_plan does not already exist' do
      before do
        allow(Stripe::Plan).to receive(:retrieve).and_raise(
          Stripe::InvalidRequestError.new('No such stripe_plan: ', 'stripe_plan')
        )
      end

      it 'creates new stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create)
      end

      it 'uses stripe_plan id in format "climate_offset_[price]_[currency]_monthly" for created stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create).with(hash_including(id: 'climate_offset_3_6_usd_monthly'))
      end

      it 'uses monthly billing interval for created stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create).with(hash_including(interval: 'month'))
      end

      it 'uses provided currency for created stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create).with(hash_including(currency: price.currency.iso_code))
      end

      it 'uses provided amount for created stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create).with(hash_including(amount: 3_60))
      end

      it 'uses product name in format "Climate Offset [price] [currency] Monthly" for created stripe_plan' do
        plan.retrieve_or_create_stripe_plan

        expect(Stripe::Plan).to have_received(:create)
          .with(hash_including(product: { name: 'Climate Offset 3.6 usd Monthly' }))
      end

      it 'returns created stripe_plan' do
        created_stripe_plan = plan.retrieve_or_create_stripe_plan

        expect(created_stripe_plan).to be(stripe_plan)
      end
    end
  end
end
