# frozen_string_literal: true

class GenericFlightFootprint
  # rubocop:disable Layout/AlignHash
  PLF          = 0.77          # Passenger load factor
  CF           = 0.951         # Cargo factor
  P            = 0.51          # Pre-production factor
  M            = 2.7           # Multiplier for non-CO2 emission effects
  EF           = 3.150         # Emission factor (kg CO2e per kg fuel)
  DC_550       = 50            # Detour constant (< 550 km)
  DC_550_5500  = 100           # Detour constant (550 km - 5500 km)
  DC_5500      = 125           # Detour constant (> 5500 km)

  LONG_HAUL_CONSTANTS = {
    a:           0.000134576,  # Polynomal fit model
    b:           6.1798,
    c:           3446.20,
    s:           280.39,       # Average seat number
    cw: {                      # Cabin class weight
      economy:   0.800,
      premium_economy: 0.9,
      business:  1.54,
      first:     2.40
    }.freeze
  }.freeze

  SHORT_HAUL_CONSTANTS = {
    a:           3.87871E-05,  # Polynomal fit model
    b:           2.9866,
    c:           1263.42,
    s:           158.44,       # Average seat number
    cw: {                      # Cabin class weight
      economy:   0.960,
      premium_economy: 1.0,
      business:  1.26,
      first:     2.40
    }.freeze
  }.freeze
  # rubocop:enable Layout/AlignHash

  def initialize(distance, cabin_class)
    @distance = distance
    @cabin_class = cabin_class
  end

  def footprint
    if @distance > 2500
      calculate(@distance, LONG_HAUL_CONSTANTS).round
    elsif @distance < 1500
      calculate(@distance, SHORT_HAUL_CONSTANTS).round
    else
      lh = calculate(2500, LONG_HAUL_CONSTANTS)
      sh = calculate(1500, SHORT_HAUL_CONSTANTS)

      (sh + (lh - sh) * (@distance - 1500) / 1000).round
    end
  end

  private

  def calculate(distance, constants)
    a, b, c, s = constants.values_at(:a, :b, :c, :s)
    cw = constants[:cw][@cabin_class]

    x = distance + detour_constant(distance)
    ((a * (x**2) + b * x + c) / (s * PLF)) * CF * cw * (EF * M + P)
  end

  def detour_constant(distance)
    if distance < 550
      DC_550
    elsif distance > 5500
      DC_5500
    else
      DC_550_5500
    end
  end
end
