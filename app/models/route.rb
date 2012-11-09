class Route < ActiveRecord::Base
	has_many :point_routes
	has_many :point_stops, :through => :point_routes
end
