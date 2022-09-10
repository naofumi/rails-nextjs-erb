class ApplicationController < ActionController::Base
  layout :devise_layout

  private

    def devise_layout
      if devise_controller?
        'authentication'
      end
    end

    def after_sign_out_path_for(resource_or_scope)
      new_user_session_path
    end
end
