# frozen_string_literal: true

class ErrorsController < ApplicationController
  layout false
  def error_404
    render 'errors/not_found', :status => 404
  end
end
