class PointStop < ActiveRecord::Base
	has_many :routes, :through => :point_routes

	def self.station_calc(lat, lon, radius)
		#Lista de terminais (stations) que possuem ônibus que passam na DESTINO 
		#::OBS:: Essa pesquisa pode ser melhorada ao máximo para parecer com o resultado de "st_acess_dest.uniq!"
		acess_local = Route.select("distinct name_route, station").where("ST_DWithin('POINT(#{lat} #{lon})', path, #{radius}) AND station IS NOT NULL").map! {|r| r[:station]}

		#Lista de terminais (stations) que possuem ônibus que passam na origem ORGANIZADA
		st_acess = acess_local.join(",").gsub(/;/,",").gsub(/,,/,",").split(",").map  do |prefix|
		  prefix.strip!
		  prefix.prepend('TER.FOR.')
		end

		st_acess.uniq!

		#Lista de todos os terminais (stations) por ordem de proximidade da origem
		st_near = PointStop.select("cod_point, ST_AsText(coord_desc) as coord_desc, ST_Distance('POINT(#{lat} #{lon})', coord_desc) as dist").where("refer = 2").order("dist").map {|n|
		  n[:cod_point]}

		return st_acess - (st_near - st_acess) #(st_near & st_acess)
	end
end
