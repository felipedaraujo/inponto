class CreatePointStops < ActiveRecord::Migration
  def change
    create_table :point_stops do |t|
      t.point   :coord_desc, :geographic => true
      t.integer :refer
      t.string  :cod_point
      t.string  :next_to
      t.string  :route_point

      t.timestamps
    end

    change_table :point_stops do |t|
      t.index :coord_desc, :spatial => true
    end
  end
end
