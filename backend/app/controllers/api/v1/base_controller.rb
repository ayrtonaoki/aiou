module Api
  module V1
    class BaseController < ApplicationController
      include ActionController::Cookies
      respond_to :json

      before_action :authenticate_user!

      private

      def current_api_user
        current_user
      end
    end
  end
end
