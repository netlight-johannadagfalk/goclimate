class ActionCategory < ApplicationRecord
    has_many :actions , foreign_key: 'action_id'
end
