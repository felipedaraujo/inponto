class PointRoute < ActiveRecord::Base
	belongs_to :point_stop 
	belongs_to :route
end
