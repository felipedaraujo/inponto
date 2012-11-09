
namespace :kml_data do
  desc 'Put the data kml_etufor in the database'
  task :set_data => :environment do

    ActiveRecord::Base.connection.execute(
    	"truncate table routes, point_stops;
		alter sequence routes_id_seq restart with 1;
		alter sequence point_stops_id_seq restart with 1;"
	)

	#lê o kml das rotas

	kml_route = Nokogiri::XML File.read("lib/tasks/kml/Transporte_Coletivo_Fortaleza.kml")
	kml_route.remove_namespaces!

	kml_route.xpath("/kml//Folder//Folder//Placemark").each do |placemark|		
		name_aux = placemark.xpath(".//name").text.split(/\s-\s/)

		#coord_route possuia a ordem das latitude e longitudes invertidas
		coord_route = placemark.xpath(".//coordinates").text.strip.gsub(/,/,' ').gsub(/\s0\s/,',').gsub(/\s0/,'')
		
		#real_coor_route corrige a inversão das coordenadas
		real_coord_route = coord_route.split(/,/).map do |coordinated|
			coord_route_long = coordinated.split(/\s/)[0] 
			coord_route_lat = coordinated.split(/\s/)[1]
			"#{coord_route_lat} #{coord_route_long}"
		end

		#if !Route.exists?(name_route:name_aux[0..1].join(' ').gsub(/\/1/,'').strip.gsub(/\(STPC\)/,'- topic'),
		#				  sense_way: (name_aux.last.strip.downcase == "ida") ? true : false)
		Route.create(
			cod_route: name_aux[0],
			name_route: name_aux[0..1].join(' ').gsub(/\/1/,'').strip.gsub(/\(STPC\)/,'- topic'),
			sense_way: (name_aux.last.strip.downcase == "ida") ? true : false,
			path: "LINESTRING(#{real_coord_route.join(',')})"
		)
		#end

	end


	#lê o kml dos pontos
	kml_point = Nokogiri::XML File.read("lib/tasks/kml/Pontos_de_Paradas_Fortaleza.kml")
	kml_point.remove_namespaces!
	
	kml_point.xpath("/kml//Folder//Placemark").each do|placemark|	
		


		#alternando a ordem das coordenadas do ponto de parada
		coord_long = placemark.xpath(".//coordinates").text.split(/,/)[0]#longitude do ponto de parada
		coord_lat = placemark.xpath(".//coordinates").text.split(/,/)[1]#latitude do ponto de parada
		coord_desc = "#{coord_lat} #{coord_long}"
		
		#descrição do ponto
		description = placemark.xpath(".//description").text
		#exibe a referência do ponto
		next_to = description.split(/b>/)[6].gsub(/<br></,'')
		#exibe quais linhas passam por um ponto
		route_point = description.split(/<br>/)[26].gsub(/\s/,'') if description.split(/<br>/)[26]
		
		#if !Point.exists?(cod_point: placemark.xpath(".//name").text)
		PointStop.create(
			cod_point: placemark.xpath(".//name").text, 
			coord_desc: "POINT(#{coord_desc})",
			next_to: next_to,
			route_point: route_point
		)
		#end
	end
  end
end