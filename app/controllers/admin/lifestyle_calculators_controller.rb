# frozen_string_literal: true

module Admin
  class LifestyleCalculatorsController < AdminController
    def index
      @calculators = calculators
    end

    def show
      @calculator = LifestyleCalculator.find(params[:id])
    end

    def new
      @calculator = LifestyleCalculator.find_or_initialize_draft_by_countries(
        params[:countries].reject(&:blank?).presence
      )
    end

    def create
      @calculator = LifestyleCalculator.find_or_initialize_draft_by_countries(
        params[:lifestyle_calculator][:countries]
      )

      @calculator.attributes =
        params.require(:lifestyle_calculator).permit(
          :country, :housing_formula, :food_formula, :car_formula, :flights_formula, :consumption_formula,
          :public_formula, :car_distance_unit
        ).merge(options_params)

      render(:new) && return unless @calculator.save

      redirect_to [:admin, @calculator]
    end

    def review
      @calculator = LifestyleCalculator.find(params[:id])

      render_not_found && return if @calculator.version.present?
    end

    def publish
      calculator = LifestyleCalculator.find(params[:id])
      calculator.version = params[:version].to_i
      calculator.save!

      redirect_to [:admin, calculator]
    end

    private

    def options_params
      [:region, :home, :heating, :green_electricity, :food, :car_type].map do |question|
        keys = params["#{question}_options_keys"]
        values = params["#{question}_options_values"]

        options = keys&.each_with_index&.map do |k, i|
          { 'key' => k, 'formula' => values[i] }
        end
        options.reject! { |option| option['key'].empty? }

        ["#{question}_options", (options unless options.empty?)]
      end.to_h
    end

    def calculators
      p = LifestyleCalculator.published.order(version: :desc).map do |calculator|
        [calculator.countries, { published: calculator }]
      end.to_h

      d = LifestyleCalculator.drafts.order(countries: :asc).map do |calculator|
        [calculator.countries, { draft: calculator }]
      end.to_h

      p.deep_merge(d)
    end
  end
end
