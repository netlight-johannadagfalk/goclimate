# frozen_string_literal: true

require 'rails_helper'
require 'stripe_events_consumer'

RSpec.feature 'Registrations', type: :feature, js: true do
  scenario 'New user registers' do
    # Homepage
    visit '/'
    click_link 'Offset my impact'

    # Sign up page
    fill_in 'Email', with: 'test@example.com'
    fill_in 'Password', with: 'password'
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4242424242424242')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button 'Go Climate Neutral!'

    # Wait for success page to render
    find('.dashboard-index', wait: 20)

    expect(page).to have_text 'Welcome to a climate neutral life'
    expect(page).to have_text 'We have accomplished a lot together!'
  end

  scenario 'New user registers with a 3dsecure card' do
    # Homepage
    visit '/'
    click_link 'Offset my impact'

    # Sign up page
    fill_in 'Email', with: 'test@example.com'
    fill_in 'Password', with: 'password'
    within_frame(0) do
      find('input[name=cardnumber]').send_keys('4000000000003063')
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button 'Go Climate Neutral!'

    # Wait for 3dsecure page to render
    find('#test-source-authorize-3ds', wait: 20)

    click_button 'Authorize Test Payment'

    # Wait for success page to render
    find('.dashboard-index', wait: 20)

    expect(page).to have_text 'Welcome to a climate neutral life'
    expect(page).to have_text 'We have accomplished a lot together!'
  end

  context 'for existing user' do
    context 'with 3D Secure card' do
      before do
        visit '/users/sign_up?choices=25,1,6,14,29'

        # Sign up page
        fill_in 'Email', with: 'test@example.com'
        fill_in 'Password', with: 'password'
        within_frame(0) do
          find('input[name=cardnumber]').send_keys('4000000000003063')
          find('input[name=exp-date]').send_keys '522'
          find('input[name=cvc]').send_keys '123'
        end
        click_button 'Go Climate Neutral!'

        # Wait for 3dsecure page to render
        find('#test-source-authorize-3ds', wait: 20)
        click_button 'Authorize Test Payment'

        # Wait for success page to render
        find('.dashboard-index', wait: 20)
      end

      scenario 'User updates a 3dsecure card' do
        count_emails_sent = ActionMailer::Base.deliveries.count

        # Go to payment settings page
        visit '/users/edit'
        find('.registrations-edit', wait: 20)
        click_link 'Payment Settings'
        find('.registrations-payment', wait: 20)
        expect(page).to have_text 'Payment Settings'

        # update events
        StripeEventsConsumer.new.fetch_and_process

        # an email should have been sent
        expect(ActionMailer::Base.deliveries.count).to eq(count_emails_sent + 1)

        neutral_months = StripeEvent.payments(User.find_by_email('test@example.com')).where(paid: true).count
        expect(neutral_months).to be(1)

        # update card
        click_link 'edit card'
        within_frame(0) do
          find('input[name=cardnumber]').send_keys('4000000000003063')
          find('input[name=exp-date]').send_keys '522'
          find('input[name=cvc]').send_keys '123'
        end
        click_button 'Update'

        # Wait for 3dsecure page to render
        find('#test-source-authorize-3ds', wait: 20)
        click_button 'Authorize Test Payment'

        # Wait for payment page to render
        find('.registrations-payment', wait: 20)

        # update events
        StripeEventsConsumer.new.fetch_and_process
        neutral_months = StripeEvent.payments(User.find_by_email('test@example.com')).where(paid: true).count
        expect(neutral_months).to be(2)

        # another email should have been sent
        expect(ActionMailer::Base.deliveries.count).to eq(count_emails_sent + 2)
      end
    end
  end
end
