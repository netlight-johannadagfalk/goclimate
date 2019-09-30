# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ApiKey, type: :model do
  describe 'validations' do
    subject(:empty_api_key) { described_class.new }

    it 'validates key to be unique' do
      existing = create(:api_key)

      api_key = described_class.new(key: existing.key)

      expect(api_key).not_to be_valid
    end

    it 'validates key to be 24 characters of [a-f0-9]' do
      api_key = build(:api_key)

      api_key.key = 'not a sha'

      expect(api_key).not_to be_valid
    end

    it 'validates name to be present' do
      empty_api_key.validate

      expect(empty_api_key.errors).to have_key(:name)
    end

    it 'validates usage description to be present' do
      empty_api_key.validate

      expect(empty_api_key.errors).to have_key(:usage_description)
    end

    it 'validates contact name to be present' do
      empty_api_key.validate

      expect(empty_api_key.errors).to have_key(:contact_name)
    end

    it 'validates contact email to be present' do
      empty_api_key.validate

      expect(empty_api_key.errors).to have_key(:contact_email)
    end

    it 'validates contact email to be an email' do
      empty_api_key.contact_email = 'not an email'
      empty_api_key.validate

      expect(empty_api_key.errors).to have_key(:contact_email)
    end
  end

  describe 'callbacks' do
    it 'generates key when creating a new API key' do
      api_key = described_class.create(name: 'A', usage_description: 'B', contact_name: 'C', contact_email: 'a@b.c')

      expect(api_key.key).to be_present
    end

    it 'does not overwrite key when changing existing gift card' do
      api_key = create(:api_key)

      expect do
        api_key.contact_email = 'new@example.com'
        api_key.save
      end.not_to change(api_key, :key)
    end
  end
end
