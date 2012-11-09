class HomeController < ApplicationController
  def index

  end

  def point_layer
  	sql = "SELECT ST_AsKML('SRID=4326;' || ST_AsText(coord_desc)) as kml, coord_desc from point_stops limit 5"
  	result = ActiveRecord::Base.connection.execute(sql)
  	content = result.map {|y| "<Placemark>#{y["kml"]}</Placemark>"}
  	render :text => "<kml>#{content.join('')}</kml>", :content_type => "text/xml"
  end

  def kml	
  	render :file => Rails.root.join('public','cta.kml'), :content_type => "text/xml", :layout => false
  end
end
