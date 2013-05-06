class CreatePointStops < ActiveRecord::Migration
  def change
    create_table :point_stops do |t|
      t.string :cod_point
      t.point :coord_desc
      t.string :next_to
      t.string :route_point
      t.integer :refer

      t.timestamps
    end
  end
end
