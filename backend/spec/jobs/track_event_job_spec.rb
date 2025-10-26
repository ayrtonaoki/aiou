# backend/spec/jobs/track_event_job_spec.rb
require 'rails_helper'

RSpec.describe TrackEventJob, type: :job do
  let!(:user) { User.create!(email: 'test@example.com', password: 'password123', password_confirmation: 'password123') }
  let(:metadata) do
    {
      ip: '127.0.0.1',
      user_agent: 'RSpec',
      scheme: 'http',
      url: 'http://example.com',
      method: 'POST',
      format: 'json'
    }
  end

  describe 'job execution' do
    it 'creates an Event with correct attributes' do
      occurred_at = Time.current

      expect {
        TrackEventJob.new.perform(user.id, 'signup', metadata, occurred_at)
      }.to change(Event, :count).by(1)

      event = Event.last
      expect(event.user).to eq(user)
      expect(event.event_type).to eq('signup')
      expect(event.metadata).to eq(metadata.stringify_keys)  # chave convertida para string
      expect(event.occurred_at.to_i).to eq(occurred_at.to_i)
    end

    it 'does nothing if the user does not exist' do
      expect {
        TrackEventJob.new.perform(-1, 'signup', metadata, Time.current)
      }.not_to change(Event, :count)
    end
  end

  describe 'job enqueuing' do
    it 'can be enqueued with ActiveJob' do
      ActiveJob::Base.queue_adapter = :test

      expect {
        TrackEventJob.perform_later(user.id, 'login', metadata, Time.current)
      }.to have_enqueued_job(TrackEventJob).with(
        user.id,
        'login',
        kind_of(Hash),
        kind_of(ActiveSupport::TimeWithZone)
      )
    end
  end
end
