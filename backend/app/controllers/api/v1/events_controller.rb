class Api::V1::EventsController < Api::V1::BaseController
  def event_stats
    start_date = 30.days.ago.beginning_of_day

    data = Event.where('occurred_at >= ?', start_date)
                .group(:event_type)
                .group_by_day(:occurred_at)
                .count

    formatted = {}
    data.each do |(type, date), count|
      formatted[date] ||= { date: date, login: 0, signup: 0, logout: 0 }
      formatted[date][type] = count
    end

    render json: formatted.values.sort_by { |d| d[:date] }
  end
end
