#encoding: utf-8
class HomeController < ApplicationController
  
  #autocomplete :route, :name_route

  def index
    
      
  end

  #Lista de nomes das rotas baseado em uma pesquisa
  def search_name_route
    #results = Route.select("name_route, ST_AsText(path) as path").where('name_route ILIKE ? and sense_way = true', "%#{params[:term]}%").limit(10).map{|r| {label: r.name_route, value:r.cod_route}}
    results = Route.select("distinct name_route, cod_route").where('name_route ILIKE ? ', "%#{params[:term]}%").limit(10).map{|r| {label: "#{r.name_route}", id: "#{r.cod_route}", category: "Itinerários"}}
    render json: results
  end

  
  #Coordenadas que formam a polilinhas de uma rotas
  def search_coord_route
    results = Route.select("st_asgeojson(path) as path").where("cod_route = ?", "#{params[:id]}")
    
    results.map! do |value|
     ActiveSupport::JSON.decode(value[:path])["coordinates"]
    end
    
    #respond_to do |format|
     # format.html do
        #render controller: "home", action: "index"
        render json: results
      #end
      #format.json{render json: results}
    #end

  end

  #Rotas que passam em uma determinada localidade
  def search_route_point
    (lat, lon) = params[:point].split(",")
    
    #AS LINHA A SEGUIR RETORNAM ROTAS ORDENADAS POR DISTANCIA
    #transport_station = PointStop.select("ST_AsText(coord_desc) as coord_desc").where("type = 2").map do |e|
    #  sql_results = "SELECT name_route, cod_route, ST_Distance('POINT(#{latOring} #{lonOring})'::geography, path::geography) as dist FROM (select distinct on (name_route) name_route, cod_route, path::geography,ST_Distance('POINT(#{latOring} #{lonOring})'::geography, path::geography) as dist from routes WHERE (ST_Distance('POINT(#{latOring} #{lonOring})'::geography, path::geography) <= 500 AND ST_Distance('#{e[:coord_desc]}'::geography, path::geography) <= 50)) subselect  ORDER BY dist"
    #  results << orig_route_station = ActiveRecord::Base.connection.execute(sql_results)
    #end
    
    results = Route.select("distinct name_route, cod_route").where("ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) <= 500")
    render json: results
  end

  def search_route_two_point

    (latOring, lonOring, latDest, lonDest) = params[:point].split(",")
     
    results = Route.select("distinct name_route, cod_route").where("ST_Distance('POINT(#{latOring} #{lonOring})'::geography, path::geography) <= 500 AND ST_Distance('POINT(#{latDest} #{lonDest})'::geography, path::geography) <= 500")

    if(results == [])
      
      lat1, lon1, lat2, lon2 = latOring, lonOring, latDest, lonDest

      
      for i in 1..2  do

        if i == 1
          lat, lon = lat1, lon1
        else
          lat, lon = lat2, lon2
        end
        
        #Lista de terminais (stations) que possuem ônibus que passam na DESTINO 
        #::OBS:: Essa pesquisa pode ser melhorada ao máximo para parecer com o resultado de "st_acess_dest.uniq!"
        acess_local = Route.select("distinct name_route, station").where("ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) <= 500").map! {|r| r[:station]}

        #Lista de terminais (stations) que possuem ônibus que passam na origem ORGANIZADA
        st_acess = acess_local.join(",").gsub(/;/,",").gsub(/,,/,",").split(",").map! {|prefix| prefix.prepend('TER.FOR.')}
        st_acess.uniq!

        #Lista de todos os terminais (stations) por ordem de proximidade da origem
        st_near = PointStop.select("cod_point, ST_AsText(coord_desc) as coord_desc, ST_Distance('POINT(#{lat} #{lon})'::geography, coord_desc::geography) as dist").where("refer = 2").order("dist").map! {|n|
          n[:cod_point]}

        #array_temp = st_near - st_acess
        st_list_dest = st_near - (st_near - st_acess)

        if i == 1
          st_list_oring = st_list_dest
        end

      end

      st_integration = st_list_oring & st_list_dest

      results << [PointStop.select("next_to, ST_AsText(coord_desc) as coord_desc").where("cod_point = '#{st_integration[0]}'").first]

      for i in 1..2  do

        if i == 1
          lat, lon = lat1, lon1
        else
          lat, lon = lat2, lon2
        end
        
        st_integration.first(1).each do |st|

          coord_st = PointStop.select("ST_AsText(coord_desc) as coord_desc").where("cod_point = '#{st}'")
          
          station = st.split('.').last
          
          #Captura a 'hora atual'
          daybreak = "#{Time.now.localtime.hour}#{Time.now.localtime.min}".to_i
          
          #Se a 'hora atual' for as 00:00 e 05:20 será feita a consulta a seguir
          if (0 < daybreak and daybreak < 520)

            sql_results = "SELECT name_route, cod_route, ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) as dist FROM (select distinct on (name_route) name_route, cod_route, path::geography,ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) as dist from routes WHERE (ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) <= 500 AND ST_Distance('#{coord_st.first[:coord_desc]}'::geography, path::geography) <= 50 AND station ILIKE '%#{station}%' AND name_route ILIKE '%Corujão%')) subselect  ORDER BY dist LIMIT 2"
            results << ActiveRecord::Base.connection.execute(sql_results)
          end

          #Se a 'hora atual' não for de madrugada, não retornará 'itineráios corujão'
          sql_results = "SELECT name_route, cod_route, ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) as dist FROM (select distinct on (name_route) name_route, cod_route, path::geography,ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) as dist from routes WHERE (ST_Distance('POINT(#{lat} #{lon})'::geography, path::geography) <= 500 AND ST_Distance('#{coord_st.first[:coord_desc]}'::geography, path::geography) <= 50 AND station ILIKE '%#{station}%' AND name_route NOT ILIKE '%Corujão%')) subselect  ORDER BY dist LIMIT 2"
          results << ActiveRecord::Base.connection.execute(sql_results)

        end
      end   
    end

    render json: results

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

end