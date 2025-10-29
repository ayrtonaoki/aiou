require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    config.load_defaults 7.0

    # Configuration for the application, engines, and railties goes here.
    config.api_only = true

    # Enable sessions and cookies for Devise
    config.session_store :cookie_store, key: '_backend_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options

    config.active_job.queue_adapter = :sidekiq
  end
end
