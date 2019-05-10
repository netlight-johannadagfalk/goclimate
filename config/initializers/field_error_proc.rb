# frozen_string_literal: true

ActionView::Base.field_error_proc = proc do |html_tag, _|
  %(<div class="field_with_errors has-error">#{html_tag}</div>).html_safe
end
