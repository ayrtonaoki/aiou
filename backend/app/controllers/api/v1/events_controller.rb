class Api::V1::EventsController < Api::V1::BaseController
  def login_stats
    data = Event.where(user_id: current_user.id, event_type: "login")
                .group_by_day(:occurred_at)
                .count

    render json: data
  end
end
