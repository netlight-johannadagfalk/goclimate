# frozen_string_literal: true

class BusinessContact
  include ActiveModel::Model

  attr_accessor :name, :company, :email, :phone, :preferred_contact_method, :message, :locale

  validates :email, email: true
  validates :preferred_contact_method, inclusion: %w[email phone], allow_nil: true

  def self.model_name
    @model_name ||= ActiveModel::Name.new(self, nil, 'contact')
  end

  def populate_for_employee_offset_request(number_of_employees)
    self.message = <<~TEXT
      Please contact me about offsetting for our employees. We're #{number_of_employees} employees.
    TEXT
  end

  def customer_name
    company.presence || name.presence
  end

  def subject_line
    if customer_name.present?
      "GoClimate & #{customer_name} (via web form)"
    else
      'Contact request via web form'
    end
  end

  def message_with_metadata
    <<~TEXT
      #{message.presence || 'No message provided'}

      ---

      #{metadata_text}
    TEXT
  end

  private

  def metadata_text
    [
      ("Name: #{name}" if name.present?),
      ("Company: #{company}" if company.present?),
      ("Phone: #{phone}" if phone.present?),
      ("Contact me via: #{preferred_contact_method}" if preferred_contact_method.present?),
      "Locale used on web: #{locale}"
    ].compact.join("\n")
  end
end
