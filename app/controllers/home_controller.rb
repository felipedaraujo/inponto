#encoding: utf-8
class HomeController < ApplicationController
  def index

  end

  def point_layer
        sql_point_route = " SELECT cod_route, name_route from routes;
                            SELECT ST_AsKML('SRID=4326;' || ST_AsText(coord_desc)) as id, kml, next_to, cod_route from point_stops INNER JOIN point_routes"
        result = ActiveRecord::Base.connection.execute(sql_point_route)
        content = result.map do |y|
          y[]
          "<description><![CDATA[<p>Próximo a: #{y["next_to"]}</p>]]></description>
          <Placemark>#{y["kml"]}</Placemark>"
        end
        render :text => "<kml>#{content.join('')}</kml>", :content_type => "text/xml"
  end

  def kml       
        render :file => Rails.root.join('public','cta.kml'), :content_type => "text/xml", :layout => false
  end
end