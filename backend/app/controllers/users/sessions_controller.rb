class Users::SessionsController < Devise::SessionsController
  include ActionController::Cookies
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)

    TrackEventJob.perform_later(
      resource.id,
      "login",
      metadata,
      Time.current
    )

    render json: { message: "Logged in successfully.", user: resource }, status: :ok
  end

  def destroy
    if current_user
      TrackEventJob.perform_later(
        current_user.id,
        "logout",
        metadata,
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

  private

  def metadata
    {
      email: request.params["user"]["email"],
      ip: request.remote_ip,
      user_agent: request.user_agent,
      scheme: request.scheme,
      url: request.url,
      method: request.method,
      format: request.format.to_s
    }
  end
end
