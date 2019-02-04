# frozen_string_literal: true

require 'rails_helper'
require 'gift_card_certificate_pdf_generator'

RSpec.describe GiftCardCertificatePDFGenerator do
  describe '.from_gift_card' do
    let(:gift_card) { build(:gift_card) }

    it 'uses message from gift_card' do
      generator = described_class.from_gift_card(gift_card)

      expect(generator.message).to eq gift_card.message
    end

    it 'uses number_of_months from gift_card' do
      generator = described_class.from_gift_card(gift_card)

      expect(generator.number_of_months).to eq gift_card.number_of_months
    end
  end

  describe '#initialize' do
    it 'sets provided message' do
      generator = described_class.new(message: 'test message', number_of_months: 3, example: true)

      expect(generator.message).to eq 'test message'
    end

    it 'sets provided number_of_months' do
      generator = described_class.new(message: 'test message', number_of_months: 3, example: true)

      expect(generator.number_of_months).to eq 3
    end

    it 'sets provided example flag' do
      generator = described_class.new(message: 'test message', number_of_months: 3, example: true)

      expect(generator.example).to be true
    end

    it 'defaults example attribute to false' do
      generator = described_class.new(message: 'test message', number_of_months: 3)

      expect(generator.example).to be false
    end
  end

  describe '#generate_pdf' do
    subject(:pdf_generator) do
      described_class.new(message: 'test message', number_of_months: 3)
    end

    let(:mocked_wicked_pdf) { instance_double(WickedPdf) }
    let(:mocked_pdf) { 'PDF' }
    let(:mocked_html) { 'HTML' }

    before do
      allow(mocked_wicked_pdf).to receive(:pdf_from_string).and_return(mocked_pdf)
      allow(WickedPdf).to receive(:new).and_return(mocked_wicked_pdf)
      allow(ApplicationController).to receive(:render).and_return(mocked_html)
    end

    it 'generates a PDF' do
      pdf = pdf_generator.generate_pdf

      expect(pdf).to be mocked_pdf
    end

    it 'specifies portrait orientation' do
      pdf_generator.generate_pdf

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string)
        .with(anything, hash_including(orientation: 'portrait'))
    end

    it 'uses HTML rendered from ActionController.render to WickedPDF' do
      pdf_generator.generate_pdf

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string).with(mocked_html, anything)
    end

    it 'renders with correct template' do
      pdf_generator.generate_pdf

      expect(ApplicationController).to have_received(:render).with(hash_including(template: 'pdfs/gift_card'))
    end

    it 'renders with no layout' do
      pdf_generator.generate_pdf

      expect(ApplicationController).to have_received(:render).with(hash_including(layout: false))
    end

    it 'renders with message in assigns' do
      pdf_generator.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(message: pdf_generator.message)))
    end

    it 'renders with number of months in assigns' do
      pdf_generator.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(number_of_months: pdf_generator.number_of_months)))
    end

    it 'renders with example in assigns' do
      pdf_generator.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(example: pdf_generator.example)))
    end
  end
end
