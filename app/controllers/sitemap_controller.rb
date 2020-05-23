# frozen_string_literal: true
# frozen_string_literal: true

class SitemapController < ApplicationController
  before_action :set_base_url

  def index
    respond_to do |format|
      format.xml
    end
  end

  def content
    @locations = []
    pages = %w[
      about contact business faq press 100_percent_transparency travel_calculator
      our_projects flights gift_cards
    ]

    Region.all.each do |region|
      pages.each do |page|
        @locations << (region.slug.nil? ? page : "#{region.slug}/#{page}")
      end
    end

    respond_to do |format|
      format.xml
    end
  end

  def set_base_url
    @base_url = "#{request.protocol}#{request.host_with_port}/"
  end
end
