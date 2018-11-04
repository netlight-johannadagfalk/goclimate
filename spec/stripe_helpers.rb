# frozen_string_literal: true

module StripeHelpers
  def stripe_json_fixture(fixture_path)
    JSON.parse(file_fixture(fixture_path).read, object_class: OpenStruct)
  end
end
