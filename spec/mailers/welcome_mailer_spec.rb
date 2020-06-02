# frozen_string_literal: true

require 'rails_helper'

RSpec.describe WelcomeMailer, type: :mailer do
  describe '.welcome_email' do
    let(:mail) do
      described_class.with(email: 'test@example.com').welcome_email
    end

    it 'sends an email' do
      expect do
        mail.deliver_now
      end.to change { ActionMailer::Base.deliveries.count }.by(1)
    end

    it 'renders the subject' do
      expect(mail.subject).to eq(I18n.t('mailers.welcome.subject'))
    end

    it 'renders the sender email' do
      expect(mail.from).to eql(['tove@goclimate.com'])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to match('Hello!')
    end

    it 'sets Sendgrid unsubscribe group' do
      expect(mail['asm'].value).to eq("{:group_id=>#{SENDGRID_ASM_GROUP_IDS[:welcome]}}")
    end
  end
end
