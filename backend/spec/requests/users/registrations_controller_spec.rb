require 'rails_helper'

RSpec.describe 'Users::RegistrationsController', type: :request do
  describe 'POST /users' do
    let(:valid_attributes) do
      {
        user: {
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    let(:invalid_attributes) do
      {
        user: {
          email: 'invalid_email',
          password: '123',
          password_confirmation: '456'
        }
      }
    end

    context 'when signup is successful' do
      it 'creates a new user and returns a success message' do
        expect {
          post '/users', params: valid_attributes, as: :json
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['message']).to eq('Signed up successfully.')
        expect(json['user']['email']).to eq('test@example.com')
      end

      it 'enqueues TrackEventJob with correct parameters' do
        ActiveJob::Base.queue_adapter = :test

        expect {
          post '/users', params: valid_attributes, as: :json
        }.to have_enqueued_job(TrackEventJob).with(
          kind_of(Integer),
          'signup',
          kind_of(Hash),
          kind_of(ActiveSupport::TimeWithZone)
        )
      end
    end

    context 'when signup fails' do
      it 'does not create a user and returns error messages' do
        expect {
          post '/users', params: invalid_attributes, as: :json
        }.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['message']).to eq('User creation failed.')
        expect(json['errors']).to include(
          "Email is invalid",
          "Password confirmation doesn't match Password",
          "Password is too short (minimum is 6 characters)"
        )
      end
    end
  end
end
