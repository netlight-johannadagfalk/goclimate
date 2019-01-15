# frozen_string_literal: true

require 'rails_helper'
require 'three_d_secure_verification'

RSpec.describe ThreeDSecureVerification do
  let(:amount) { 500 }
  let(:currency) { 'sek' }
  let(:card_source) { 'src_CARD' }
  let(:three_d_secure_source) { 'src_THREEDSECURE' }
  let(:return_url) { 'return_url' }

  subject(:verification) { ThreeDSecureVerification.new(card_source, amount, currency, return_url) }

  describe '.new' do
    before do
      allow(Stripe::Source).to receive(:create).and_return(
        Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure.json'))
      )
    end

    it 'creates 3D Secure source' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create)
    end

    it 'sets amount for 3D Secure source to given amount' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create).with hash_including(amount: amount)
    end

    it 'sets currency for 3D Secure source given currency' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create).with hash_including(currency: currency)
    end

    it 'sets type for 3D Secure source to three_d_secure' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create).with hash_including(type: 'three_d_secure')
    end

    it 'uses its Stripe source as card for 3D Secure source' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create)
        .with hash_including(three_d_secure: hash_including(card: card_source))
    end

    it 'sets 3D Secure return url to provided url' do
      ThreeDSecureVerification.new(card_source, amount, currency, return_url)

      expect(Stripe::Source).to have_received(:create)
        .with hash_including(redirect: hash_including(return_url: return_url))
    end
  end

  describe '.verification_required?' do
    context 'when retrieved 3D Secure source requires verfication' do
      before do
        allow(Stripe::Source).to receive(:create).and_return(
          Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure.json'))
        )
      end

      it 'returns true' do
        expect(subject.verification_required?).to be(true)
      end
    end

    context 'when retrieved 3D Secure source doesn\'t require verification' do
      before do
        allow(Stripe::Source).to receive(:create).and_return(
          Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure_not_required.json'))
        )
      end

      it 'returns false' do
        expect(subject.verification_required?).to be(false)
      end
    end

    context 'when retrieved 3D Secure source status is failed' do
      before do
        allow(Stripe::Source).to receive(:create).and_return(
          Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure_failed.json'))
        )
      end

      it 'returns false' do
        expect(subject.verification_required?).to be(false)
      end
    end
  end

  describe '.redirect_url' do
    let(:source) { Stripe::Source.construct_from(stripe_json_fixture('source_three_d_secure.json')) }

    before do
      allow(Stripe::Source).to receive(:create).and_return(source)
    end

    it 'returns redirect url from retrieved 3D Secure source' do
      expect(subject.redirect_url).to eq(source.redirect.url)
    end
  end
end
