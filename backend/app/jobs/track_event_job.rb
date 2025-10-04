class TrackEventJob < ApplicationJob
  queue_as :default

  def perform(user_id, event_type, metadata = {}, occurred_at = Time.current)
    user = User.find_by(id: user_id)
    return unless user

    Event.track(user: user, type: event_type, metadata: metadata, occurred_at: occurred_at)
  end
end
