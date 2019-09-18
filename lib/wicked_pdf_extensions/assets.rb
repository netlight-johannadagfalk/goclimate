# frozen_string_literal: true

class WickedPdf
  module WickedPdfHelper
    module Assets
      def wicked_pdf_file_base64(path)
        path = Rails.root.join(path)
        raise "Could not find file '#{path}'" unless File.exist?(path)

        base64 = Base64.encode64(File.read(path)).gsub(/\s+/, '')
        "data:#{Rack::Mime.mime_type(File.extname(path))};base64,#{Rack::Utils.escape(base64)}"
      end
    end
  end
end
