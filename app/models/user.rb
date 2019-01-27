# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable
  has_many :stripe_events, primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  has_and_belongs_to_many :lifestyle_choices
  scope :with_active_subscription, -> { where.not(stripe_customer_id: nil) }

  # Validates on default contexts :create and :update. Use any other context,
  # e.g. valid?(:precheck) to skip before stripe_customer_id is known.
  validates_presence_of :stripe_customer_id, on: [:create, :update]

  # accessor and validator of :privacy_policy are only here for client side validation via the ClientSideValidations gem
  validates :privacy_policy, acceptance: true
  attr_accessor :privacy_policy

  def country_name
    if !country.nil? && !country.empty?
      c = ISO3166::Country[country]
      c.translations[I18n.locale.to_s] || country.name
    else
      'Unknown'
    end
  end

  def number_of_neutral_months
    StripeEvent.where(stripe_object: 'charge').where(stripe_customer_id: stripe_customer_id).where(paid: true).count
  end

  def currency
    stripe_events.first.currency
  end

  def language
    if stripe_events.first.currency == 'sek'
      :sv
    elsif stripe_events.first.currency == 'eur'
      :de
    else
      :en
    end
  end

  def update_without_password(params, *options)
    if params[:password].blank?
      params.delete(:password)
      params.delete(:password_confirmation) if params[:password_confirmation].blank?
    end

    result = update_attributes(params, *options)
    clean_up_passwords
    result
  end
end
