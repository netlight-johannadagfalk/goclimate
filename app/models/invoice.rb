# frozen_string_literal: true

class Invoice < ApplicationRecord
  include HasMoneyAttributes

  belongs_to :project, optional: true

  money_attribute :amount_in_sek, Currency::SEK
  money_attribute :offsetting_subtotal, Currency::SEK
  money_attribute :consulting_subtotal, Currency::SEK
  money_attribute :products_subtotal, Currency::SEK

  validates :certificate_reciever_email, email: true
end
