InPonto::Application.configure do

  config.cache_classes = true

  config.consider_all_requests_local       = true

  config.action_controller.perform_caching = true

  config.serve_static_assets = true

  config.assets.compress = true

  config.assets.compile = true

  config.assets.digest = true

  config.i18n.fallbacks = true

  config.active_support.deprecation = :notify

  config.assets.initialize_on_precompile = false
end
