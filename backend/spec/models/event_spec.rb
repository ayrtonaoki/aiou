# backend/spec/models/event_spec.rb
require 'rails_helper'

RSpec.describe Event, type: :model do
  let!(:user) { User.create!(email: 'test@example.com', password: 'password123', password_confirmation: 'password123') }

  describe 'associations' do
    it 'belongs to user' do
      event = Event.new(user: user, event_type: 'signup', occurred_at: Time.current)
      expect(event.user).to eq(user)
    end
  end

  describe 'validations' do
    it 'is valid with event_type and occurred_at' do
      event = Event.new(user: user, event_type: 'login', occurred_at: Time.current)
      expect(event).to be_valid
    end

    it 'is invalid without event_type' do
      event = Event.new(user: user, occurred_at: Time.current)
      expect(event).not_to be_valid
      expect(event.errors[:event_type]).to include("can't be blank")
    end

    it 'is invalid without occurred_at' do
      event = Event.new(user: user, event_type: 'logout')
      expect(event).not_to be_valid
      expect(event.errors[:occurred_at]).to include("can't be blank")
    end

    it 'allows only valid event_type values' do
      %w[signup login logout].each do |type|
        event = Event.new(user: user, event_type: type, occurred_at: Time.current)
        expect(event).to be_valid
      end
    end
  end

  describe '.track' do
    it 'creates an Event with correct attributes' do
      metadata = { ip: '127.0.0.1', user_agent: 'RSpec' }
      occurred_at = Time.current

      expect {
        Event.track(user: user, type: 'signup', metadata: metadata, occurred_at: occurred_at)
      }.to change(Event, :count).by(1)

      event = Event.last
      expect(event.user).to eq(user)
      expect(event.event_type).to eq('signup')
      expect(event.metadata).to eq(metadata.stringify_keys)
      expect(event.occurred_at.to_i).to eq(occurred_at.to_i)
    end
  end
end
