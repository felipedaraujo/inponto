class PointStopRoute < ActiveRecord::Base
	belongs_to :route
  	belongs_to :point_stop
end
