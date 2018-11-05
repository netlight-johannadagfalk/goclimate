# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GiftCardMailer, type: :mailer do
  describe '.gift_card_email' do
    it 'sends an email' do
      expect { GiftCardMailer.with(email: 'test@example.com', number_of_months: '3', filename: 'filename.pdf').gift_card_email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    let(:mail) { GiftCardMailer.with(email: 'test@example.com', number_of_months: '3', filename: 'testfilename.pdf').gift_card_email }

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

    it 'has the correct attatchment' do
      expect(mail.attachments.size).to eql(1)
      attachment = mail.attachments[0]
      expect(attachment).to be_a_kind_of(Mail::Part)
      expect(attachment.content_type).to be_start_with('application/pdf;')
      expect(attachment.filename).to eql('testfilename.pdf')
    end
  end
end
