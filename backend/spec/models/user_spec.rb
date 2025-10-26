# backend/spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it 'has many events' do
      assoc = described_class.reflect_on_association(:events)
      expect(assoc.macro).to eq(:has_many)
      expect(assoc.options[:dependent]).to eq(:destroy)
    end
  end

  describe 'validations' do
    it 'is valid with valid email and password' do
      user = User.new(email: 'test@example.com', password: 'password123', password_confirmation: 'password123')
      expect(user).to be_valid
    end

    it 'is invalid without email' do
      user = User.new(password: 'password123', password_confirmation: 'password123')
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'is invalid without password' do
      user = User.new(email: 'test@example.com')
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("can't be blank")
    end
  end

  describe 'dependent destroy' do
    it 'destroys associated events when user is destroyed' do
      user = User.create!(email: 'test@example.com', password: 'password123', password_confirmation: 'password123')
      Event.create!(user: user, event_type: 'signup', occurred_at: Time.current)

      expect {
        user.destroy
      }.to change(Event, :count).by(-1)
    end
  end
end
