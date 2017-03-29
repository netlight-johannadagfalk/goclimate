json.extract! stripe_event, :id, :stripe_event_id, :stripe_customer_id, :stripe_object, :stripe_status, :stripe_amount, :stripe_created, :created_at, :updated_at
json.url stripe_event_url(stripe_event, format: :json)
