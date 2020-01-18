# frozen_string_literal: true

task update_airports_csv: :environment do
  warn 'Fetching latest Opentraveldata file...'
  opentraveldata_por_public = open('https://raw.githubusercontent.com/opentraveldata/opentraveldata/master/opentraveldata/optd_por_public.csv')

  warn 'Importing...'
  opentraveldata_importer = FootprintCalculation::OpentraveldataAirportsImporter.new('config/airports.csv', opentraveldata_por_public)
  opentraveldata_importer.import

  warn 'Done'
end
