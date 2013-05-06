class Route < ActiveRecord::Base
	has_and_belongs_to_many :point_stops
end
