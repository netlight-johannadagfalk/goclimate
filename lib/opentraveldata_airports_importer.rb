# frozen_string_literal: true

require 'csv'

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
          line['iata_code'], line['name'], parse_swedish_name(line['alt_name_section']),
          line['latitude'], line['longitude']
        ]
      end
    end
  end

  private

  def por_public_airports
    # Our dataset includes fields with unescaped " while using no quote
    # characters. CSV doesn't allow setting quote_char to nil, so use $ which
    # is hopefully unlikely as a name.
    @por_public_airports ||= CSV.parse(@por_public_csv, headers: true, col_sep: '^', quote_char: '$')
                                .select { |line| %w[AIRP AIRF AIRQ].include?(line['fcode']) }
  end

  def parse_swedish_name(alt_name_section)
    swedish_alt_name = alt_name_section&.split('|')&.each_slice(2)&.find { |alt_name| alt_name[0] =~ /sv/ }
    swedish_alt_name[1] if swedish_alt_name.present?
  end
end
