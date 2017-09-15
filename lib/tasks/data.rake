namespace :data do
	task :fortaleza => :environment do
		ActiveRecord::Base.connection.execute(
	  	"truncate table routes, point_stops, point_stop_routes;
			alter sequence routes_id_seq restart with 1;
			alter sequence point_stops_id_seq restart with 1;
			alter sequence point_stop_routes_id_seq restart with 1;"
		)

		Rake::Task['station:fortaleza'].invoke
		Rake::Task['bus_route:fortaleza'].invoke
		Rake::Task['bus_stop:fortaleza'].invoke
	end
end
