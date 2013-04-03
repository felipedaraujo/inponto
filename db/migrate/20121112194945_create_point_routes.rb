class CreatePointRoutes < ActiveRecord::Migration
  def change
    create_table :point_routes do |t|
      t.integer :point_id
      t.string :cod_route

      t.timestamps
    end
  end
end
