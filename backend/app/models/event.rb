class Event < ApplicationRecord
  belongs_to :user

  enum event_type: { signup: "signup", login: "login", logout: "logout" }

  validates :event_type, presence: true
  validates :occurred_at, presence: true

  def self.track(user:, type:, metadata: {}, occurred_at: Time.current)
    create!(user: user, event_type: type, metadata: metadata, occurred_at: occurred_at)
  end
end
