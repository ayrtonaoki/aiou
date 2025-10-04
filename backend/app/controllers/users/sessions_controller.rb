class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    self.resource = warden.authenticate(auth_options)
    if resource
      TrackEventJob.perform_later(
        resource.id,
        "login",
        { ip: request.remote_ip, user_agent: request.user_agent },
        Time.current
      )

      sign_in(resource_name, resource)
      token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)
      response.set_header('Authorization', "Bearer #{token[0]}")

      render json: { message: 'Logged in', user: resource }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def destroy
    if current_user
      TrackEventJob.perform_later(
        current_user.id,
        "logout",
        { ip: request.remote_ip },
        Time.current
      )
      sign_out(resource_name)
      render json: { message: 'Logged out' }, status: :ok
    else
      render json: { message: 'No active session' }, status: :unauthorized
    end
  end
end
