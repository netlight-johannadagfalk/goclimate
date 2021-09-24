# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Subscriptions::SubscriptionMonth do
  describe '.create_from_stripe_invoice_line!' do
    let(:invoice_line) do
      Stripe::Invoice.construct_from(stripe_json_fixture('invoice_subscription_month.json')).lines.first
    end
    let(:user) { create(:user, stripe_customer_id: 'cus_TEST') }
    let(:charge) { create(:card_charge_monthly, stripe_customer_id: user.stripe_customer_id) }

    it 'sets provided payment' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.payment).to eq(charge)
    end

    it 'sets price from provided payment' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.price).to eq(Money.new(7_00, Currency::EUR))
    end

    it 'sets currency from provided payment' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.currency).to eq(Currency.from_iso_code(invoice_line.currency))
    end

    it 'sets start_at from provided invoice' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.start_at).to eq(Time.at(invoice_line.period.start))
    end

    it 'sets co2e based on plan metadata' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.co2e).to eq(GreenhouseGases.new(1_167))
    end

    it 'sets user from charge' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.user).to eq(charge.user)
    end

    it 'validates' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.errors).to be_empty
    end

    context 'with 2017 subscription plans' do
      let(:invoice_line) do
        Stripe::Invoice.construct_from(stripe_json_fixture('invoice_subscription_month_2017.json')).lines.first
      end

      it 'sets co2e based on 2017 consumer price' do
        month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

        expect(month.co2e).to eq(GreenhouseGases.new(1_000))
      end
    end
  end
end
