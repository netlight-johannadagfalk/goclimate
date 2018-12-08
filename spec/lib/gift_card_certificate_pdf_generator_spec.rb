# frozen_string_literal: true

require 'rails_helper'
require 'gift_card_certificate_pdf_generator'

RSpec.describe GiftCardCertificatePDFGenerator do
  describe '.initialize' do
    it 'sets provided attributes' do
      generator = GiftCardCertificatePDFGenerator.new(message: 'test message', number_of_months: 3, example: true)

      expect(generator.message).to eq 'test message'
      expect(generator.number_of_months).to eq 3
      expect(generator.example).to be true
    end

    it 'defaults example attribute to false' do
      generator = GiftCardCertificatePDFGenerator.new(message: 'test message', number_of_months: 3)

      expect(generator.example).to be false
    end
  end

  describe '.generate_pdf' do
    let(:mocked_wicked_pdf) { instance_double(WickedPdf) }
    let(:mocked_pdf) { 'PDF' }
    let(:mocked_html) { 'HTML' }

    subject do
      GiftCardCertificatePDFGenerator.new(message: 'test message', number_of_months: 3)
    end

    before do
      allow(mocked_wicked_pdf).to receive(:pdf_from_string).and_return(mocked_pdf)
      allow(WickedPdf).to receive(:new).and_return(mocked_wicked_pdf)
      allow(ApplicationController).to receive(:render).and_return(mocked_html)
    end

    it 'generates a PDF' do
      pdf = subject.generate_pdf

      expect(pdf).to be mocked_pdf
    end

    it 'specifies portrait orientation' do
      subject.generate_pdf

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string)
        .with(anything, hash_including(orientation: 'portrait'))
    end

    it 'uses HTML rendered from ActionController.render to WickedPDF' do
      subject.generate_pdf

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string).with(mocked_html, anything)
    end

    it 'renders with correct template' do
      subject.generate_pdf

      expect(ApplicationController).to have_received(:render).with(hash_including(template: 'gift_cards/gift_card'))
    end

    it 'renders with no layout' do
      subject.generate_pdf

      expect(ApplicationController).to have_received(:render).with(hash_including(layout: false))
    end

    it 'renders with message in assigns' do
      subject.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(message: subject.message)))
    end

    it 'renders with number of months in assigns' do
      subject.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(number_of_months: subject.number_of_months)))
    end

    it 'renders with example in assigns' do
      subject.generate_pdf

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(example: subject.example)))
    end
  end
end
