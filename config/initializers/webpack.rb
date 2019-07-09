# frozen_string_literal: true

ActiveSupport.on_load :action_controller do
  ActionController::Base.helper Webpack::Helper
end

ActiveSupport.on_load :action_view do
  include Webpack::Helper
end
