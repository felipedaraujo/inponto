#encoding: utf-8
namespace :bus_route do
  desc 'Put the data kml_etufor in the database'
  task :fortaleza => :environment do

		# lê o kml das rotas
		kml_route = Nokogiri::XML File.read("lib/tasks/kml/Transporte_Coletivo_Fortaleza.kml")
		kml_route.remove_namespaces!
		kml_route.xpath("/kml//Folder//Folder//Placemark").each do |placemark|		
			name_aux = placemark
								 .xpath(".//name")
								 .text.split(/\s-\s/)
			
			name_route = name_aux[0..1]
									 .join(' ')
									 .gsub(/\/1/,'')
									 .strip
									 .gsub(/\(STPC\)/,'- topic')

			# coord_route possuia a ordem das latitude e longitudes invertidas
			coord_route = placemark
										.xpath(".//coordinates")
										.text.strip.gsub(/,/,' ')
										.gsub(/\s0\s/,',')
										.gsub(/\s0/,'')
			
			# real_coord_route refina as coordenadas devido o kml possui as coordenadas invertidas
			real_coord_route = coord_route.split(/,/).map do |coordinated|
				coord_route_long = coordinated.split(/\s/)[0] 
				coord_route_lat = coordinated.split(/\s/)[1]
				"#{coord_route_lat} #{coord_route_long}"
			end

			description = placemark.xpath(".//description").text.split(/<br>/)[3]
			stations_route = nil
			if  description != nil && description.split(/b>/)[2]
				stations_route = description.split(/b>/)[2].strip
			end

			Route.create(
				cod_route: name_aux[0],
				name_route: name_route,
				sense_way: (name_aux.last.strip.downcase == "ida") ? true : false,
				path: "LINESTRING(#{real_coord_route.join(',')})",
				station: stations_route,
			)

			puts "OK => #{name_route}"
		end
		puts "#{Route.count} Itinerários cadastradas com sucesso!!"	
	end
end
