#encoding: utf-8
class HomeController < ApplicationController
  
  def index
      
      @search_route = Route.select('name_route').all.map(&:name_route)
  end


  def point_layer
    sql_point_route = "SELECT ST_AsKML('SRID=4326;' || ST_AsText(coord_desc)) as kml, next_to, name_route 
                        FROM point_stops INNER JOIN point_routes ON point_stops.id = point_routes.point_id
                        INNER JOIN routes ON point_routes.cod_route = routes.cod_route
                        WHERE routes.sense_way = true;"

    result_sql = ActiveRecord::Base.connection.execute(sql_point_route)
            
    content = result_sql.group_by { |y| y["kml"] }.values.map do |y|
      "<Placemark>
      <description><![CDATA[
        <div class='infowindow_style'>
            <div class='title_infowindow'>
                 <p class='name_stop'>Referência:</p>
                 <p>#{y.first['next_to']}</p>
            </div>
            <div class='title_list'>
                <table>
                    <tr>
                        <td class='name_route'>Rota(s):</td>
                    </tr>
                </table>
            </div>
            <div class='list_infowindow'>
                <table>
                        #{y.map { |it| "<tr><td class='name_route'> #{it['name_route']} </td></tr>"}.join('')}
                </table>
            </div>
        </div>]]></description>
        #{y.first['kml']}
        </Placemark>"
    end

    render :text => "<kml>#{content.join('')}</kml>", :content_type => "text/xml"
  end


  def kml       
        render :file => Rails.root.join('public','cta.kml'), :content_type => "text/xml", :layout => false
  end


end