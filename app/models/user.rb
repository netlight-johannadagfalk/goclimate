class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable
  has_many :stripe_events, class_name: "StripeEvent", primary_key: 'stripe_customer_id', foreign_key: 'stripe_customer_id'
  has_and_belongs_to_many :lifestyle_choices

  def country_name
    if !country.nil? && !country.empty?
      c = ISO3166::Country[country]
      c.translations[I18n.locale.to_s] || country.name
    else
      "Unknown"
    end
  end

  def number_of_neutral_months
    StripeEvent.where(stripe_object: "charge").where(stripe_customer_id: stripe_customer_id).where(paid: true).count
  end

  def currency
    stripe_events.first.currency
  end

  def language
    if stripe_events.first.currency == "sek"
      :sv
    else
      :en
    end
  end
end
