# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCardCertificatePdf do
  subject(:pdf) { described_class.new(gift_card) }

  let(:gift_card) { build(:gift_card) }

  describe '#render' do
    let(:mocked_wicked_pdf) { instance_double(WickedPdf) }
    let(:mocked_pdf) { 'PDF' }
    let(:mocked_html) { 'HTML' }

    before do
      allow(mocked_wicked_pdf).to receive(:pdf_from_string).and_return(mocked_pdf)
      allow(WickedPdf).to receive(:new).and_return(mocked_wicked_pdf)
      allow(ApplicationController).to receive(:render).and_return(mocked_html)
    end

    it 'generates a PDF' do
      rendered_pdf = pdf.render

      expect(rendered_pdf).to be mocked_pdf
    end

    it 'specifies portrait orientation' do
      pdf.render

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string)
        .with(anything, hash_including(orientation: 'portrait'))
    end

    it 'uses HTML rendered from ActionController.render to WickedPDF' do
      pdf.render

      expect(mocked_wicked_pdf).to have_received(:pdf_from_string).with(mocked_html, anything)
    end

    it 'renders with correct template' do
      pdf.render

      expect(ApplicationController).to have_received(:render).with(hash_including(template: 'pdfs/gift_card'))
    end

    it 'renders with no layout' do
      pdf.render

      expect(ApplicationController).to have_received(:render).with(hash_including(layout: false))
    end

    it 'renders with gift_card in assigns' do
      pdf.render

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(gift_card: gift_card)))
    end

    it 'defaults to example being false' do
      pdf.render

      expect(ApplicationController).to have_received(:render)
        .with(hash_including(assigns: hash_including(example: false)))
    end

    context 'when example is true' do
      subject(:pdf) { described_class.new(gift_card, example: true) }

      it 'sets example to true in assigns' do
        pdf.render

        expect(ApplicationController).to have_received(:render)
          .with(hash_including(assigns: hash_including(example: true)))
      end
    end
  end
end
