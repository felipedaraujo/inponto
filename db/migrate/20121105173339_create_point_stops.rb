class CreatePointStops < ActiveRecord::Migration
  def change
    create_table :point_stops do |t|
      t.string :cod_point
      t.point :coord_desc, :geographic => true
      t.string :next_to
      t.string :route_point
      t.integer :refer

      t.timestamps
    end

    change_table :point_stops do |t|
      t.index :coord_desc, :spatial => true
    end
  end
end
