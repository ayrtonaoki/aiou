require 'faker'

puts "🧹 Limpando banco de dados..."
Event.delete_all
User.delete_all

puts "👤 Criando usuários..."

users = []

3.times do |i|
  # Datas de criação aleatórias para cada usuário nos últimos 30 dias
  created_at = Faker::Date.backward(days: rand(5..30))

  users << User.create!(
    email: "user#{i + 1}@example.com",
    password: "password123",
    password_confirmation: "password123",
    created_at: created_at,
    updated_at: created_at
  )
end

puts "✅ Criados #{users.count} usuários."

puts "📅 Gerando eventos pareados por dia..."

users.each do |user|
  signup_date = user.created_at.to_date
  signup_time = Faker::Time.between_dates(from: signup_date, to: signup_date, period: :morning)

  Event.create!(
    user: user,
    event_type: 'signup',
    occurred_at: signup_time,
    metadata: {
      ip_address: Faker::Internet.ip_v4_address,
      browser: Faker::Internet.user_agent,
      location: Faker::Address.city
    }
  )

  active_days = Array.new(rand(3..6)) do
    Faker::Date.between(from: signup_date, to: Date.today)
  end.uniq.sort

  active_days.each do |day|
    rand(1..3).times do
      login_time = Faker::Time.between_dates(from: day, to: day, period: :morning)
      logout_time = login_time + rand(5..180).minutes
      logout_time = [logout_time, login_time.end_of_day - 1.minute].min

      Event.create!(
        user: user,
        event_type: 'login',
        occurred_at: login_time,
        metadata: { ip_address: Faker::Internet.ip_v4_address, browser: Faker::Internet.user_agent }
      )

      Event.create!(
        user: user,
        event_type: 'logout',
        occurred_at: logout_time,
        metadata: { ip_address: Faker::Internet.ip_v4_address, browser: Faker::Internet.user_agent }
      )
    end
  end
end

total_events = Event.count
puts "\n✅ Criados #{total_events} eventos no total."
puts "📊 Distribuição por tipo:"
Event.group(:event_type).count.each do |type, count|
  puts " - #{type}: #{count}"
end

puts "\n🕒 Intervalo de eventos:"
puts " - Mais antigo: #{Event.minimum(:occurred_at)}"
puts " - Mais recente: #{Event.maximum(:occurred_at)}"
