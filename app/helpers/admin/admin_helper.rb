# frozen_string_literal: true

module Admin
  module AdminHelper
    def project_id_options_for_select(projects, co2e_required = 0, selected = nil)
      co2e_required = GreenhouseGases.new(co2e_required)

      options_for_select(projects.map do |project|
        [
          "#{project.name} (#{project.co2e_available} available)",
          project.id,
          project.co2e_available < co2e_required ? { disabled: '' } : {}
        ]
      end, selected)
    end
  end
end
