# frozen_string_literal: true

module Admin
  class BusinessCalculatorsController < AdminController
    include BusinessCalculatorsHelper
    before_action :set_calculator, only: [:show, :edit, :update, :destroy, :publish, :archive, :duplicate]
    before_action :set_units, only: [:new, :edit, :update]
    before_action :verify_editable, only: [:edit, :update]

    def index
      not_archived = BusinessCalculators::Calculator.where("status != 'archived'").order(name: :asc)
      archived = BusinessCalculators::Calculator.where(status: 'archived').order(name: :asc)
      @calculators = not_archived + archived
    end

    def show
      @reports = ClimateReports::Report.joins_report_areas.where(
        'climate_reports_report_areas.calculator_id': @calculator.id
      )
    end

    def new
      @calculator = BusinessCalculators::Calculator.new
    end

    def edit
    end

    def create
      begin
        @calculator = BusinessCalculators::Calculator.create!(calculator_params.except('categories_attributes'))
        calculator_params['categories_attributes'].each_value do |new_category|
          next unless new_category['name'].present?

          category = @calculator.categories.create!(name: new_category['name'])
          new_category['fields_attributes'].each_value do |new_field|
            category.fields.create!(new_field) if new_field['label'].present?
          end
        end
        update_order(@calculator, calculator_params['category_order'])
      rescue ActiveRecord::RecordInvalid
        return render :new
      end
      redirect_to [:admin, @calculator], notice: 'Calculator was successfully created.'
    end

    def update
      return render :edit unless @calculator.update(calculator_params)

      update_order(@calculator, calculator_params['category_order'])
      redirect_to [:admin, @calculator], notice: 'Calculator was successfully updated.'
    end

    def publish
      @calculator.publish

      redirect_to admin_business_calculators_url, notice: 'Calculator was successfully published.'
    end

    def archive
      @calculator.archive

      redirect_to admin_business_calculators_url, notice: 'Calculator was successfully archived.'
    end

    def duplicate
      if @calculator.duplicate
        redirect_to admin_business_calculators_url, notice: 'Calculator was successfully duplicated.'
      else
        redirect_to admin_business_calculators_url, notice: 'Something went wrong - calculator was not duplicated 😬'
      end
    end

    private

    def set_calculator
      @calculator = BusinessCalculators::Calculator.find(params[:id])
    end

    def set_units
      @units = BusinessCalculators::Unit.all.order(name: :asc)
    end

    def verify_editable
      redirect_to admin_business_calculators_url, notice: 'Publihsed/archived calculator can\'t be edited.' unless @calculator.draft? # rubocop:disable Metrics/LineLength
    end

    def calculator_params
      params.require(:business_calculator).permit(
        :name,
        :category_order,
        :survey,
        {
          categories_attributes: [
            :id,
            :name,
            :description,
            :field_order,
            :_destroy,
            { fields_attributes: [:id, :label, :field_type, :multiple_answers, :_destroy,
                                  { alternatives: [], units: [] }] }
          ]
        }
      )
    end
  end
end
