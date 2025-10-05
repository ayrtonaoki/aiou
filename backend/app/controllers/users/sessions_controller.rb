class Users::SessionsController < Devise::SessionsController
  include ActionController::Cookies
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)

    TrackEventJob.perform_later(
      resource.id,
      "login",
      { ip: request.remote_ip },
      Time.current
    )

    render json: { message: "Logged in successfully.", user: resource }, status: :ok
  end

  def destroy
    if current_user
      TrackEventJob.perform_later(
        current_user.id,
        "logout",
        { ip: request.remote_ip },
        Time.current
      )
    end

    sign_out(current_user)
    render json: { message: "Logged out successfully." }, status: :ok
  end

  def current
    if current_user
      render json: { user: current_user }, status: :ok
    else
      render json: { user: nil }, status: :ok
    end
  end
end
