# frozen_string_literal: true

require 'gift_card_certificate_pdf_generator'
require 'csv'
require 'fileutils'

# Apple Numbers uses the Unicode paragraph break character for newlines, but
# Webkit doesn't display it the way we want for PDF generation, so normalize it
# into ASCII newlines.
CSV::Converters[:normalize_newlines] = ->(value) { value.tr("\u2028", "\n") }

desc 'Generate gift card certificates from CSV file'
task :generate_gift_card_certificates, [:csv_file, :locale] => :environment do |_, args|
  folder = Rails.root.join('gift_cards', Time.now.to_s)
  FileUtils.mkdir_p(folder)
  I18n.locale = args[:locale].to_sym

  CSV.read(args[:csv_file], headers: true, col_sep: ';', converters: :normalize_newlines).each do |line|
    options = {
      number_of_months: line['number_of_months'].to_i,
      message: line['message']
    }

    pdf = GiftCardCertificatePDFGenerator.new(options).generate_pdf
    File.open(folder.join("#{line['filename']}.pdf"), 'wb') { |f| f.write(pdf) }
  end
end
