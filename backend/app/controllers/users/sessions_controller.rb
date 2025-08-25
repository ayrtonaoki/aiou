class Users::SessionsController < Devise::SessionsController
  include ActionController::Cookies
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    render json: { message: 'You are logged in.', user: resource }, status: :ok
  end

  def destroy
    if current_user
      sign_out(resource_name)
      render json: { message: 'You are logged out.' }, status: :ok
    else
      render json: { message: 'No active session found.' }, status: :unauthorized
    end
  end

  private

  def respond_with(resource, _opts = {})
    render json: { message: 'You are logged in.', user: resource }, status: :ok
  end

  def respond_to_on_destroy
    log_out_success && return if current_user
    log_out_failure
  end

  def log_out_success
    render json: { message: 'You are logged out.' }, status: :ok
  end

  def log_out_failure
    render json: { message: 'Hmm nothing happened.' }, status: :unauthorized
  end
end
