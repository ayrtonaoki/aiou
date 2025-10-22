require 'rails_helper'

RSpec.describe 'Api::V1::EventsController', type: :request do
  include ActiveSupport::Testing::TimeHelpers

  describe 'GET /api/v1/events/event_stats' do
    let(:user) { create(:user) }

    before do
      sign_in user

      travel_to Time.zone.parse('2025-10-01 10:00:00') do
        Event.track(user: user, type: 'login', occurred_at: Time.current)
        Event.track(user: user, type: 'signup', occurred_at: 1.day.ago)
        Event.track(user: user, type: 'logout', occurred_at: 2.days.ago)
      end
    end

    context 'without parameters' do
      it 'returns statistics for the last 30 days' do
        get '/api/v1/events/event_stats'

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        expect(json).to all(include('date', 'login', 'signup', 'logout'))

        total_logins  = json.sum { |d| d['login'] }
        total_signups = json.sum { |d| d['signup'] }
        total_logouts = json.sum { |d| d['logout'] }

        expect(total_logins).to eq(1)
        expect(total_signups).to eq(1)
        expect(total_logouts).to eq(1)
      end
    end

    context 'with a date range' do
      it 'filters events by the given period' do
        start_date = '2025-09-29'
        end_date   = '2025-09-30'

        get '/api/v1/events/event_stats', params: { start_date: start_date, end_date: end_date }

        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        expect(json.sum { |d| d['login'] }).to eq(0)
        expect(json.sum { |d| d['signup'] }).to eq(1)
        expect(json.sum { |d| d['logout'] }).to eq(1)
      end
    end

    context 'when there are no events' do
      it 'returns an empty array' do
        Event.delete_all
        get '/api/v1/events/event_stats'
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq([])
      end
    end
  end
end
