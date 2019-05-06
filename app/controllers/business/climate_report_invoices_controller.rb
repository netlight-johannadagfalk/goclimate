# frozen_string_literal: true

module Business
  class ClimateReportInvoicesController < ApplicationController
    before_action :force_en_locale # Business pages are English only for now

    def create
      redirect_to action: :thank_you
    end

    def thank_you
    end
  end
end
