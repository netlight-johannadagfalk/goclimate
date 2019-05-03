# frozen_string_literal: true

module Business
  class ClimateReportInvoicesController < ApplicationController
    def create
      redirect_to action: :thank_you
    end

    def thank_you
    end
  end
end
