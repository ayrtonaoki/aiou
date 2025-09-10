class Users::RegistrationsController < Devise::RegistrationsController
  include ActionController::Cookies
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  def create
    build_resource(sign_up_params)
    resource.save

    yield resource if block_given?

    if resource.persisted?
      sign_up(resource_name, resource)

      render json: { message: 'Signed up successfully.', user: resource }, status: :ok
    else
      clean_up_passwords resource
      set_minimum_password_length

      render json: { message: 'User creation failed.', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def respond_with(resource, _opts = {})
    register_success && return if resource.persisted?
    register_failed
  end

  def register_success
    render json: { message: 'Signed up successfully.', user: current_user }, status: :ok
  end

  def register_failed
    render json: { message: 'Something went wrong.', errors: resource.errors.full_messages }, status: :unprocessable_entity
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
  end
end
