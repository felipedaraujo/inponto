InPonto::Application.routes.draw do
  resources :users

  #get "home/index"
  root                          :to => "home#index"
  match "home",                 :to => "home#index"
  #match "home/:id",             :to => "home#index"
  match "home/point-layer",     :to => "home#point_layer"
  #match "home/kml",            :to => "home#kml"
  match "home/name-route",      :to => "home#search_name_route"
  match "home/coord-route/:id", :to => "home#search_coord_route"
  match "home/point-stop/",     :to => "home#point_layer_dynamic"
  
  match "home/routes-by-point/",:to => "home#search_route_point"
  match "home/routes-bytwo-point", :to => "home#search_route_two_point"
  
  #resources :home do
  #  get :autocomplete_home_name_route, :on => :collection
  #end

end
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
