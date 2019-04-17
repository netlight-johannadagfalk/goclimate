# frozen_string_literal: true

task update_airports_csv: :environment do
  STDERR.puts 'Fetching latest Opentraveldata file...'
  opentraveldata_por_public = open('https://raw.githubusercontent.com/opentraveldata/opentraveldata/master/opentraveldata/optd_por_public.csv')

  STDERR.puts 'Importing...'
  opentraveldata_importer = OpentraveldataAirportsImporter.new('config/airports.csv', opentraveldata_por_public)
  opentraveldata_importer.import

  STDERR.puts 'Done'
end
