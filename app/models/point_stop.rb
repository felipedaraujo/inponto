class PointStop < ActiveRecord::Base
	has_many :routes, :through => :point_routes
end
