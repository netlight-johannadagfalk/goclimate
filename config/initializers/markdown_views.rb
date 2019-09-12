# frozen_string_literal: true

class MarkdownTemplateHandler
  def call(_template, source)
    "#{markdown.render(source).inspect}.html_safe;"
  end

  private

  def markdown
    @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML)
  end
end

ActionView::Template.register_template_handler(:md, MarkdownTemplateHandler.new)
