class CreatePointRoutes < ActiveRecord::Migration
  def change
    create_table :point_routes do |t|
      t.integer :route_id
      t.integer :point_id

      t.timestamps
    end
  end
end
