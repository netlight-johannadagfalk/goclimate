# frozen_string_literal: true

require 'csv'

module FootprintCalculation
  class OpentraveldataAirportsImporter
    def initialize(airports_csv_path, por_public_csv)
      @airports_csv_path = airports_csv_path
      @por_public_csv = por_public_csv
    end

    def import
      CSV.open(@airports_csv_path, 'w') do |csv|
        csv << %w[iata_code name name_sv latitude longitude]
        por_public_airports.each do |line|
          csv << [
            line['iata_code'],
            add_city_suffix(line['name'], line['city_name_list']),
            parse_swedish_name(line['alt_name_section'], line['city_name_list']),
            line['latitude'],
            line['longitude']
          ]
        end
        # some api-users search for 'TYO', which is a iata code for Tokyo city,
        # not an airport - and therefore not in public airport files.
        # With this ugly hack we allow searches for 'TYO'.
        # TODO: put our own data in a separate CSV and run the import
        # for both CSV's in case we get more custom data
        csv << ['TYO', 'Tokyo', 'Tokyo', 35.6895, 139.69171] unless por_public_airports.include?('TYO^')
      end
    end

    private

    def por_public_airports
      # Our dataset includes fields with unescaped " while using no quote
      # characters. CSV doesn't allow setting quote_char to nil, so use $ which
      # is hopefully unlikely as a name.
      @por_public_airports ||= CSV.parse(@por_public_csv, headers: true, col_sep: '^', quote_char: '$')
                                  .select { |line| %w[AIRP AIRF AIRQ AIRS].include?(line['fcode']) }
    end

    def parse_swedish_name(alt_name_section, city)
      swedish_alt_name = alt_name_section&.split('|')&.each_slice(2)&.find { |alt_name| alt_name[0] =~ /sv/ }
      add_city_suffix(swedish_alt_name[1], city) if swedish_alt_name.present?
    end

    def add_city_suffix(name, city)
      "#{name}, #{city}"
    end
  end
end
