json.extract! project, :id, :name, :link, :image_url, :blog_url, :certificate_url, :invoice_url, :longitude, :latitude, :carbon_offset, :country, :type, :created_at, :updated_at
json.url project_url(project, format: :json)
