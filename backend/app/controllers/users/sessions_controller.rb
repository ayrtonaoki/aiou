class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    self.resource = warden.authenticate(auth_options)

    if resource
      sign_in(resource_name, resource)

      render json: { message: 'Logged in', user: resource }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def destroy
    if current_user
      sign_out(resource_name)

      render json: { message: 'Logged out' }, status: :ok
    else
      render json: { message: 'No active session' }, status: :unauthorized
    end
  end
end
