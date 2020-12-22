# frozen_string_literal: true

require 'rails_helper'

RSpec.feature 'Subscription settings', js: true do
  let(:user) { create(:user) }

  before do
    user.update(stripe_customer_id: Stripe::Customer.create(email: user.email).id)

    log_in(user)
  end

  scenario 'Enable subscription' do
    visit '/users/subscription'
    select '€2 (3.0 tonnes CO2e)', from: 'Climate Plan'
    within_frame(0) do
      send_keys_to_card_field '4242424242424242'
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button 'Update'

    expect(page).to have_text 'Your settings has been updated', wait: 20
    expect(user.stripe_customer.subscriptions.first.status).to eq('active')
    subscription = nil
    expect { subscription = trigger_next_subscription_charge }.not_to raise_error
    expect(subscription.status).to eq('active')
  end

  scenario 'Enable subscription with 3D Secure card' do
    visit '/users/subscription'
    select '€2 (3.0 tonnes CO2e)', from: 'Climate Plan'
    within_frame(0) do
      send_keys_to_card_field '4000002500003155'
      find('input[name=exp-date]').send_keys '522'
      find('input[name=cvc]').send_keys '123'
    end
    click_button 'Update'
    authorize_3d_secure

    expect(page).to have_text 'Your settings has been updated', wait: 20
    expect(user.stripe_customer.subscriptions.first.status).to eq('active')
    subscription = nil
    expect { subscription = trigger_next_subscription_charge }.not_to raise_error
    expect(subscription.status).to eq('active')
  end

  context 'with active subscription' do
    before do
      pm_id = Stripe::PaymentMethod.attach('pm_card_visa', customer: user.stripe_customer).id
      Stripe::Customer.update(user.stripe_customer.id, invoice_settings: { default_payment_method: pm_id })
      plan_id = Stripe::Plan.retrieve_or_create_climate_offset_plan(Money.new(2_00, :eur))
      Stripe::Subscription.create(customer: user.stripe_customer_id, plan: plan_id)
    end

    scenario 'Cancel subscription' do
      visit '/users/subscription'
      find('#start_cancellation').click
      find('#confirm_cancellation', wait: 20).click

      expect(page).to have_text 'No subscription', wait: 20
      expect(user.stripe_customer.subscriptions).to be_empty
    end

    scenario 'Update to new card' do
      visit '/users/subscription'
      click_button 'Edit card'
      within_frame(0) do
        send_keys_to_card_field '4242424242424242'
        find('input[name=exp-date]').send_keys '522'
        find('input[name=cvc]').send_keys '123'
      end
      click_button 'Update'

      expect(page).to have_text 'Your settings has been updated', wait: 20
      user.stripe_customer.refresh
      expect(user.stripe_customer.subscriptions.first.status).to eq('active')
      subscription = nil
      expect { subscription = trigger_next_subscription_charge }.not_to raise_error
      expect(subscription.status).to eq('active')
    end

    scenario 'Update to 3D Secure card' do
      visit '/users/subscription'
      click_button 'Edit card'
      within_frame(0) do
        send_keys_to_card_field '4000002500003155'
        find('input[name=exp-date]').send_keys '522'
        find('input[name=cvc]').send_keys '123'
      end
      click_button 'Update'
      authorize_3d_secure

      expect(page).to have_text 'Your settings has been updated', wait: 20
      user.stripe_customer.refresh
      expect(user.stripe_customer.subscriptions.first.status).to eq('active')
      subscription = nil
      expect { subscription = trigger_next_subscription_charge }.not_to raise_error
      expect(subscription.status).to eq('active')
    end
  end

  def trigger_next_subscription_charge
    Stripe::Subscription.update(
      user.stripe_customer.subscriptions.first.id,
      billing_cycle_anchor: 'now',
      proration_behavior: 'none',
      off_session: true
    )
  end
end
