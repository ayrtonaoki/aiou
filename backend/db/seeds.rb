require 'faker'

puts "Creating users..."

users = []
3.times do |i|
  users << User.find_or_create_by!(email: "user#{i+1}@example.com") do |user|
    user.password = "password123"
    user.password_confirmation = "password123"
  end
end

puts "Created #{users.count} users."

puts "Creating events..."

event_types = ["login", "logout", "signup"]

users.each do |user|
  active_days = Array.new(rand(3..5)) { Faker::Date.backward(days: 60) }

  active_days.each do |day|
    rand(2..5).times do
      Event.create!(
        user: user,
        event_type: event_types.sample,
        occurred_at: Faker::Time.between_dates(from: day, to: day, period: :day),
        metadata: {
          ip_address: Faker::Internet.ip_v4_address,
          browser: Faker::Internet.user_agent,
          location: Faker::Address.city
        }
      )
    end
  end
end

puts "Created events for all users."
