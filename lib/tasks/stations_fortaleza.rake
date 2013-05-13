#encoding: utf-8
namespace :stations do
  desc 'Location of bus stations Fortaleza'
  task :fortaleza => :environment do
  	refer = 2
  	stations = [
  		{
  			cod_point: "TER.FOR.PAR", 
			coord_desc: "POINT(-3.776193 -38.563516)",
			next_to: "Terminal da Parangaba",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.MESS", 
			coord_desc: "POINT(-3.831129 -38.501903)",
			next_to: "Terminal de Messejana",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.PAP", 
			coord_desc: "POINT(-3.738404 -38.485075)",
			next_to: "Terminal do Papicu",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.AB", 
			coord_desc: "POINT(-3.73759 -38.584494)",
			next_to: "Terminal do Antônio Bezerra",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.SIQ", 
			coord_desc: "POINT(-3.789987 -38.586691)",
			next_to: "Terminal do Siqueira",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.LAG", 
			coord_desc: "POINT(-3.771431 -38.570418)",
			next_to: "Terminal Lagoa",
			#route_point: null,
			refer: refer,
  		},
  		{
  			cod_point: "TER.FOR.CC", 
			coord_desc: "POINT(-3.773883 -38.606173)",
			next_to: "Terminal Conjunto Ceará",
			#route_point: null,
			refer: refer,
  		}
	]

	stations.map do |e|
		PointStop.create(e)
		puts "#{e[:next_to]} Cadastrados com Sucesso"
	end
	
	

  end
end