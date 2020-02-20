# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffset do
  describe '#send_confirmation_email' do
    subject(:flight_offset) { create(:flight_offset) }

    let(:fake_pdf) { 'fake pdf' }
    let(:certificate_generator_stub) do
      instance_double(FlightOffsetCertificatePdf).tap do |pdf_generator|
        allow(pdf_generator).to receive(:render).and_return(fake_pdf)
      end
    end

    before do
      allow(FlightOffsetCertificatePdf).to receive(:new).and_return(certificate_generator_stub)
      allow(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)
    end

    it 'sends confirmation email' do
      expect(FlightOffsetMailer).to receive_message_chain(:with, :flight_offset_email, :deliver_now)

      flight_offset.send_confirmation_email
    end

    it 'sets FlightOffset for mailer' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetMailer).to have_received(:with).with(hash_including(flight_offset: flight_offset))
    end

    it 'includes a generated pdf in sent email' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetMailer).to have_received(:with).with(hash_including(certificate_pdf: fake_pdf))
    end

    it 'uses flight offset when generating pdf' do
      flight_offset.send_confirmation_email

      expect(FlightOffsetCertificatePdf).to have_received(:new).with(flight_offset)
    end
  end

  describe '#co2e' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:co2e)
    end
  end

  describe '#price' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:price)
    end

    it 'returns a Money' do
      flight_offset = build(:flight_offset, price: 100_00, currency: :sek)

      expect(flight_offset.price).to eq(Money.new(100_00, :sek))
    end
  end

  describe '#price=' do
    it 'sets currency when provided with a Money' do
      flight_offset = build(:flight_offset)

      flight_offset.price = Money.new(150_00, :sek)

      expect(flight_offset.currency).to eq(Currency::SEK)
    end

    it 'sets price as subunit amount when provided with a Money' do
      flight_offset = build(:flight_offset)

      flight_offset.price = Money.new(200_00, :sek)

      expect(flight_offset.price_before_type_cast).to eq(200_00)
    end
  end

  describe '#currency' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:currency)
    end
  end

  describe '#email' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:email)
    end
  end

  describe '#payment_intent_id' do
    it 'validates presence' do
      flight_offset = described_class.new
      flight_offset.validate
      expect(flight_offset.errors).to have_key(:payment_intent_id)
    end
  end

  describe '#key' do
    it 'validates key to be unique' do
      existing = create(:flight_offset, key: 'a9993e364706816aba3e25717850c26c9cd0d89d')
      flight_offset = described_class.new(key: existing.key)

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'validates key to look like a SHA1 (40 hex characters)' do
      flight_offset = build(:flight_offset)
      flight_offset.key = 'not a sha'

      flight_offset.validate
      expect(flight_offset.errors).to have_key(:key)
    end

    it 'generates key when creating new flight offset' do
      flight_offset = create(:flight_offset)

      expect(flight_offset.key).to be_present
    end

    it 'does not overwrite key when changing existing flight offset' do
      flight_offset = create(:flight_offset)

      expect do
        flight_offset.save
      end.not_to change(flight_offset, :key)
    end
  end

  describe '#to_param' do
    it 'returns key' do
      offset = create(:flight_offset)

      expect(offset.to_param).to eq(offset.key)
    end
  end
end
