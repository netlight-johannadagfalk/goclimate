class AddSurveyToBusinessCalculator < ActiveRecord::Migration[6.0]
  def change
    add_column :business_calculators_calculators, :survey, :boolean, default: false
  end
end
