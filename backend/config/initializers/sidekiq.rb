require "sidekiq"

redis_url = ENV.fetch("REDIS_URL", "redis://localhost:6379/1")

Sidekiq.configure_server do |config|
  config.redis = {
    url: redis_url,
    network_timeout: 10,
    reconnect_attempts: 5
  }

  Rails.logger.info "✅ Sidekiq conectado ao Redis em #{redis_url}"
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: redis_url,
    network_timeout: 10,
    reconnect_attempts: 5
  }
end
