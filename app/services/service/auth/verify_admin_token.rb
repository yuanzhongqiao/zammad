# Copyright (C) 2012-2023 Zammad Foundation, https://zammad-foundation.org/

class Service::Auth::VerifyAdminToken < Service::Base
  include Service::Auth::Concerns::CheckPasswordLogin

  attr_reader :token

  def initialize(token:)
    super()
    @token = token
  end

  def execute
    raise Exceptions::UnprocessableEntity, __('This feature is not enabled.') if password_login?

    user = ::User.admin_password_auth_via_token(token)
    raise Exceptions::UnprocessableEntity, __('The login is not possible.') if !user

    user
  end
end
