# frozen_string_literal: true

class SitemapController < ApplicationController
  before_action :set_base_url

  def index
    respond_to do |format|
      format.xml
    end
  end

  def content
    @all_urls = []
    url_helpers = [
      :about, :contact, :business, :faq, :transparency, :travel_calculator,
      :projects, :flight_footprints, :gift_cards
    ]

    Region.all.each do |region|
      @all_urls += url_helpers.map { |helper| [polymorphic_url(helper, region: region), helper] }
    end

    respond_to do |format|
      format.xml
    end
  end

  def set_base_url
    @base_url = "#{request.protocol}#{request.host_with_port}/"
  end
end
