#encoding: utf-8
class HomeController < ApplicationController
  
  #autocomplete :route, :name_route

  def index
    
      
  end 

  #Lista de nomes das rotas baseado em uma pesquisa
  def search_name_route
    #results = Route.select("name_route, ST_AsText(path) as path").where('name_route ILIKE ? and sense_way = true', "%#{params[:term]}%").limit(10).map{|r| {label: r.name_route, value:r.cod_route}}
    results = Route.select('distinct name_route, cod_route').where('name_route ILIKE ? ', "%#{params[:term]}%").limit(10).map{|r| {label: "#{r.name_route}", id: "#{r.cod_route}"}}
    render json: results
  end

  
  #Coordenadas que formam a polilinhas de uma rotas
  def search_coord_route
    results = Route.select("st_asgeojson(path) as path").where("cod_route = ?", "#{params[:id]}")
    
    results.map! do |value|
     ActiveSupport::JSON.decode(value[:path])["coordinates"]
    end
    
    respond_to do |format|
      format.html do
        render controller: "home", action: "index"
        #render json: results
      end
      format.json{render json: results}
    end

  end

  #Rotas que passam em uma determinada localidade
  def search_route_point
    results = Route.where("st_intersects")
    
  end


  #Pontos de parada visiveis na tela atual do usuário
  def point_layer_dinamic
    (lat1, long1, lat2, long2) = params[:bounds].split(",")
    bounds = [[lat1,long1], [lat2,long1], [lat2,long2], [lat1,long2], [lat1,long1]]
    bounds.map! {|e| e.join(' ')}
    
    results = PointStop.select("st_asgeojson(coord_desc) as coord_desc").where ("st_intersects(coord_desc, 'POLYGON((#{bounds.join(',')}))')")
    
    results.map! do |value|
      ActiveSupport::JSON.decode(value[:coord_desc])["coordinates"]
    end
    
    render json: results
  end

=begin
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

    render :text => "#{content[3545..4728].join('')}", :content_type => "text/xml"
  end

  def kml       
        render :file => Rails.root.join('public','cta.kml'), :content_type => "text/xml", :layout => false
  end
=end
end