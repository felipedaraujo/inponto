class CreatePointStopRoutes < ActiveRecord::Migration
  def change
    create_table :point_stop_routes do |t|
      t.integer :point_stop_id
      t.integer :route_id

      t.timestamps
    end
  end
end
