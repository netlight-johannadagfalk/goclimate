# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCardMailer, type: :mailer do
  describe '.gift_card_email' do
    let(:mail) do
      described_class.with(
        email: 'test@example.com',
        number_of_months: '3',
        gift_card_pdf: 'fake pdf contents'
      ).gift_card_email
    end

    it 'sends an email' do
      expect do
        mail.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it 'renders the subject' do
      expect(mail.subject).to eql(I18n.t('gift_card_email_subject'))
    end

    it 'renders the receiver email' do
      expect(mail.to).to eql(['test@example.com'])
    end

    it 'renders the sender email' do
      expect(mail.from).to eql(['info@goclimateneutral.org'])
    end

    it 'matches number of months' do
      expect(mail.body.encoded).to match('3 climate neutral months.')
    end

    it 'has an attachment' do
      expect(mail.attachments.size).to be(1)
    end

    it 'sets content type for attachment to application/pdf' do
      expect(mail.attachments.first.content_type).to start_with('application/pdf;')
    end

    it 'sets attachment filename to "GoClimateNeutral Gift Card.pdf"' do
      expect(mail.attachments.first.filename).to eql('GoClimateNeutral Gift Card.pdf')
    end

    it 'sets the attachment body' do
      expect(mail.attachments.first.body).to be_present
    end

    it 'sets Sendgrid unsubscribe group' do
      expect(mail['asm'].value).to eq("{:group_id=>#{SENDGRID_ASM_GROUP_IDS[:gift_card]}}")
    end
  end
end
