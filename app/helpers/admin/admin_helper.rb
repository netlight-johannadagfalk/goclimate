# frozen_string_literal: true

module Admin
  module AdminHelper
    def project_id_options_for_select(projects, co2e_required = 0)
      options_for_select(projects.map do |project|
        [
          "#{project.name} (#{number_with_delimiter(project.co2e_available, delimiter: ' ')} kg available)",
          project.id,
          project.co2e_available < co2e_required ? { disabled: '' } : {}
        ]
      end)
    end
  end
end
