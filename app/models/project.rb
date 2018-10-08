class Project < ApplicationRecord
  def self.total_carbon_offset
    cdm_project_cost = Project.where("offset_type = 'CDM'").sum("cost_in_sek")
    cdm_project_tonnes = Project.where("offset_type = 'CDM'").sum("carbon_offset")
    user_offset = ((StripeEvent.total_in_sek - cdm_project_cost) / LifestyleChoice::SEK_PER_TONNE).round + cdm_project_tonnes

    user_offset + Invoice.sum("carbon_offset")
  end
end
