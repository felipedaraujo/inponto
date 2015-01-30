#encoding: utf-8
namespace :bus_stop do
  desc 'Put the data kml_etufor in the database'
  task :fortaleza => :environment do

		#lê o kml dos pontos
		kml_point = Nokogiri::XML File.read("lib/tasks/kml/Pontos_de_Paradas_Fortaleza.kml")
		kml_point.remove_namespaces!
		kml_point.xpath("/kml//Folder//Placemark").each do|placemark|			

			#refinando as coordenadas do ponto de parada, a ordem deve ser inversa devido o kml
			coord_long = placemark.xpath(".//coordinates").text.split(/,/)[0]#longitude do ponto de parada
			coord_lat = placemark.xpath(".//coordinates").text.split(/,/)[1]#latitude do ponto de parada
			coord_desc = "#{coord_lat} #{coord_long}"
			
			#descrição do ponto
			description = placemark.xpath(".//description").text
			#exibe a referência do ponto
			next_to = description.split(/b>/)[6].gsub(/<br></,'')
			#exibe quais linhas passam por um ponto
			route_point = description.split(/<br>/).last.gsub(/\s/,'') if description.split(/<br>/).last
			
			point_stop_tables = PointStop.create(
				cod_point: placemark.xpath(".//name").text, 
				coord_desc: "POINT(#{coord_desc})",
				next_to: next_to,
				route_point: route_point,
				refer: 1
			)

			puts "OK => Parada #{placemark.xpath(".//name").text}"

			point_id = point_stop_tables.id
			
			#se a string route_point não retornas nenhuma linha, então será atribuido **sem rotas**
			route_point = "Sem rotas" if !(route_point =~ /^\d/)
			
			route_point.split(/;/).map do |single_cod_route|

				if(single_cod_route != "Sem rotas")
					route_id = Route.find_by_cod_route(single_cod_route).id

					PointStopRoute.create(
						point_stop_id: point_id,
						route_id: route_id
					)
				end
			end
		end
		puts "#{PointStop.count} Pontos de Parada Cadastrados com Sucesso!"
  end
end
