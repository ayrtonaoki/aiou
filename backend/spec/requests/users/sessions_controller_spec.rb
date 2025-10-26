# backend/spec/requests/users/sessions_controller_spec.rb
require 'rails_helper'

RSpec.describe 'Users::SessionsController', type: :request do
  let!(:user) { User.create!(email: 'test@example.com', password: 'password123', password_confirmation: 'password123') }

  describe 'POST /login' do
    let(:valid_credentials) do
      {
        user: {
          email: user.email,
          password: 'password123'
        }
      }
    end

    let(:invalid_credentials) do
      {
        user: {
          email: user.email,
          password: 'wrongpassword'
        }
      }
    end

    context 'with valid credentials' do
      it 'logs in the user and returns a success message' do
        ActiveJob::Base.queue_adapter = :test

        post '/login', params: valid_credentials, as: :json

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['message']).to eq('Logged in successfully.')
        expect(json['user']['email']).to eq(user.email)

        expect(TrackEventJob).to have_been_enqueued.with(
          user.id,
          'login',
          kind_of(Hash),
          kind_of(ActiveSupport::TimeWithZone)
        )
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized' do
        post '/login', params: invalid_credentials, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /logout' do
    it 'logs out the user and enqueues logout job' do
      ActiveJob::Base.queue_adapter = :test

      # login first
      post '/login', params: { user: { email: user.email, password: 'password123' } }, as: :json

      delete '/logout', as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['message']).to eq('Logged out successfully.')

      expect(TrackEventJob).to have_been_enqueued.with(
        user.id,
        'logout',
        kind_of(Hash),
        kind_of(ActiveSupport::TimeWithZone)
      )
    end
  end

  describe 'GET /current_user' do
    it 'returns current user if logged in' do
      # login first
      post '/login', params: { user: { email: user.email, password: 'password123' } }, as: :json

      get '/current_user', as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['user']['email']).to eq(user.email)
    end

    it 'returns nil if not logged in' do
      get '/current_user', as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['user']).to be_nil
    end
  end
end
