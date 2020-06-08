# frozen_string_literal: true

module About
  class PressController < ApplicationController
    def show
      @press_images = Dir.glob('app/assets/images/press/*.*')
      @press_social_images = Dir.glob('app/assets/images/press_social/*.*')
    end
  end
end
