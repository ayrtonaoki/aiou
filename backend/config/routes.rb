require "sidekiq/web"

Rails.application.routes.draw do
  # Sidekiq Web UI
  mount Sidekiq::Web => "/sidekiq"

  devise_for :users,
             controllers: {
               registrations: 'users/registrations',
               sessions: 'users/sessions'
             },
             defaults: { format: :json }

  devise_scope :user do
    post '/signup', to: 'users/registrations#create'
    post '/login', to: 'users/sessions#create'
    delete '/logout', to: 'users/sessions#destroy'
    get '/current_user', to: 'users/sessions#current'
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get 'events/event_stats', to: 'events#event_stats'
    end
  end

  root to: "home#index"
end
