class Route < ActiveRecord::Base
	has_many :point_routes
	has_many :point_stops, :through => :point_routes

	def self.corujao?
		Time.parse("0:00:00 -0300") < Time.now and Time.now < Time.parse("5:20:00 -0300")
	end

	def self.return_two_routes(st_integration, lat, lon)
      results = []
      st = st_integration.first

      #coord_st = PointStop.select("ST_AsText(coord_desc) as coord_desc").where("cod_point = '#{st}'").first
      coord_sql = PointStop.select("ST_AsText(coord_desc) as coord_desc").where("cod_point = '#{st}'").to_sql
      coord_st = ActiveRecord::Base.connection.execute(coord_sql).first['coord_desc']
      unless coord_st.blank?
        station = st.split('.').last
        sql_results = "SELECT name_route, cod_route, ST_Distance('POINT(#{lat} #{lon})', path) as dist FROM "+
        "(select distinct on (name_route) name_route, cod_route, path,ST_Distance('POINT(#{lat} #{lon})', path) as dist from routes "+
        "WHERE (ST_DWithin('POINT(#{lat} #{lon})', path, 500) AND ST_DWithin('#{coord_st}', path, 50) "+
        "AND station ILIKE '%#{station}%' AND name_route " + ((corujao?) ? "" : "NOT ")+ 
        "ILIKE '%Coruj%')) subselect " + 
        "ORDER BY dist LIMIT 2"
        results << ActiveRecord::Base.connection.execute(sql_results)
      end
      return results
    end
end
