# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FlightOffsetMailer, type: :mailer do
  describe '.flight_offset_email' do
    let(:flight_offset) { create(:flight_offset) }
    let(:fake_pdf) { 'fake pdf contents' }
    let(:mail) do
      described_class.with(flight_offset: flight_offset, certificate_pdf: fake_pdf).flight_offset_email
    end

    it 'sends an email' do
      expect do
        mail.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it 'renders the subject' do
      expect(mail.subject).to eq(I18n.t('mailers.flight_offset.subject'))
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([flight_offset.email])
    end

    it 'renders the sender email' do
      expect(mail.from).to eql(['info@goclimateneutral.org'])
    end

    it 'has an attachment' do
      expect(mail.attachments.size).to be(1)
    end

    it 'sets content type for attachment to application/pdf' do
      expect(mail.attachments.first.content_type).to start_with('application/pdf;')
    end

    it 'sets attachment filename to "GoClimateNeutral Gift Card.pdf"' do
      expect(mail.attachments.first.filename).to eql('GoClimateNeutral Offset Certificate.pdf')
    end

    it 'sets the attachment body' do
      expect(mail.attachments.first.body).to be_present
    end

    it 'sets Sendgrid unsubscribe group' do
      expect(mail['asm'].value).to eq("{:group_id=>#{SENDGRID_ASM_GROUP_IDS[:flight_offset]}}")
    end
  end
end
