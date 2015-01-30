#encoding: utf-8
class HomeController < ApplicationController

  #autocomplete :route, :name_route

  #Lista de nomes das rotas baseado em uma pesquisa
  def search_name_route
    results = Route.select("distinct name_route, cod_route").where('name_route ILIKE ? ', "%#{params[:term]}%").limit(10).map{|r| {label: "#{r.name_route}", id: "#{r.cod_route}", category: "Itinerários"}}
    render json: results
  end
  
  #Coordenadas que formam a polilinhas de uma rotas
  def search_coord_route
    sql_results = Route.select("ST_AsGeoJSON(path) as path")
                       .where("cod_route = ?", "#{params[:id]}").to_sql

    resp = ActiveRecord::Base.connection.execute(sql_results).map do |value|
      ActiveSupport::JSON.decode(value["path"])["coordinates"]
    end
    render json: resp
  end

  #Rotas que passam em uma determinada localidade
  def search_route_point
    (lat, lon) = params[:point].split(",")
    radius = params[:radius]
    
    results = Route.select("distinct name_route, cod_route")
                   .where("ST_DWithin('POINT(#{lat} #{lon})', path, ?)", "#{radius}")
    render json: results
  end

  def search_route_two_point
    (latOring, lonOring, latDest, lonDest) = params[:point].split(",")
    (radiusOrigin, radiusDest) = params[:radius].split(",")

    results = Route.select("distinct name_route, cod_route")
                   .where("ST_DWithin('POINT(#{latOring} #{lonOring})', path, ?) AND ST_DWithin('POINT(#{latDest} #{lonDest})', path, ?)", radiusOrigin, radiusDest)
    #se results for vazio, não há rota direta
    if results.empty?
      st_list_oring = PointStop.station_calc(latOring, lonOring, radiusOrigin)
      st_list_dest = PointStop.station_calc(latDest, lonDest, radiusDest)
      
      #elege o melhor terminal
      st_integration = (st_list_oring & st_list_dest)
      
      sql_results = PointStop.select("next_to, ST_AsText(coord_desc) as coord_desc").where("cod_point = '#{st_integration.first}'").to_sql
      results << ActiveRecord::Base.connection.execute(sql_results)
      results << Route.return_two_routes(st_integration, latOring, lonOring).first
      results << Route.return_two_routes(st_integration, latDest, lonDest).first
    end

    render json: results
  end

  #Pontos de parada visiveis na tela atual do usuário
  def point_layer_dynamic
    (lat1, long1, lat2, long2) = params[:bounds].split(",")
    bounds = [[lat1,long1], [lat2,long1], [lat2,long2], [lat1,long2], [lat1,long1]]
    bounds.map! {|e| e.join(' ')}
    
    sql_results = PointStop.select("st_asgeojson(coord_desc) as coord_desc").
    where("st_intersects(coord_desc, 'POLYGON((#{bounds.join(',')}))')").to_sql 
    
    resp = ActiveRecord::Base.connection.execute(sql_results).map do |value|
      ActiveSupport::JSON.decode(value["coord_desc"])["coordinates"]
    end
    
    render json: resp
  end
  
end