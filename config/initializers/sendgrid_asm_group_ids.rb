# frozen_string_literal: true

SENDGRID_ASM_GROUP_IDS =
  if ENV['SENDGRID_ASM_GROUP_IDS'] == 'production'
    {
      subscription: 16_739,
      gift_card: 21_453,
      flight_offset: 22_943
    }
  else
    {
      subscription: 8691,
      gift_card: 8345,
      flight_offset: 9519
    }
  end
