Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001' # Frontend React app URL

    resource '*',
      headers: :any,
      methods: [:get, :post, :delete, :options, :head],
      credentials: true
  end
end
