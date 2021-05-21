# frozen_string_literal: true

module Business
  class ContactsController < ApplicationController
    def new
      @contact = BusinessContact.new
    end

    def create
      @contact = BusinessContact.new(contact_params)
      @contact.locale = I18n.locale

      if params[:number_of_employees].present?
        @contact.populate_for_employee_offset_request(params[:number_of_employees])
      end

      unless @contact.valid?
        render :new
        return
      end

      BusinessMailer.contact_email(@contact).deliver
    end

    private

    def contact_params
      params.require(:contact).permit(:name, :company, :email, :phone, :preferred_contact_method, :message)
    end
  end
end
