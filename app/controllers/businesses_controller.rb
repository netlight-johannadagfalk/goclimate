# frozen_string_literal: true

# TODO: The name of this controller is made slightly confusing after the
# introduction of the business namespace and might benefit from being moved
# into the namespace and getting a more specific name such as
# Business::EmployeeOffsetsController
class BusinessesController < ApplicationController
  def create
    @email = params[:email]
    BusinessMailer.employee_offset_notice_email(@email, params[:number_of_employees], I18n.locale).deliver
  end
end
