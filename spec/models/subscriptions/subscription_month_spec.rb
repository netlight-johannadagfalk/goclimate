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

      expect(month.price_incl_taxes).to eq(Money.new(7_00, :eur))
    end

    it 'sets currency from provided payment' do
      month = described_class.create_from_stripe_invoice_line!(invoice_line, charge)

      expect(month.currency).to eq(Currency::EUR)
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

  describe 'callbacks' do
    subject(:month) do
      described_class.new(start_at: Time.now, co2e: 1000, price_incl_taxes: Money.new(5_00, :eur))
    end

    it 'sets price without taxes' do
      expect(month.price).to eq(Money.new(4_00, :eur))
    end

    it 'sets VAT amount' do
      expect(month.vat_amount).to eq(Money.new(1_00, :eur))
    end

    context 'when price_incl_taxes is nil' do
      subject(:month) do
        described_class.new(start_at: Time.now, co2e: 1000)
      end

      it 'does no calculations' do
        expect(month.price).to be_nil
      end
    end

    context 'when record is already saved' do
      let(:reloaded_month) { described_class.find(month.id) }

      before do
        month.payment = create(:card_charge_monthly)
        month.user = create(:user)
        month.price = Money.new(2_00, :eur)
        month.save!
      end

      it 'does no calculations' do
        expect(reloaded_month.price).to eq(Money.new(2_00, :eur))
      end
    end
  end
end
