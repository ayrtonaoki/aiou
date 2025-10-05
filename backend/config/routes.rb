Rails.application.routes.draw do
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

  root to: "home#index"
end
