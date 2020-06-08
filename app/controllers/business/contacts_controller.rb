# frozen_string_literal: true

module Business
  class ContactsController < ApplicationController
    def create
      @email = params[:email]
      BusinessMailer.employee_offset_notice_email(@email, params[:number_of_employees], I18n.locale).deliver
    end
  end
end
