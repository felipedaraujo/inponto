class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.string :cod_route
      t.string :name_route
      t.line_string :path, :geographic => true#, :srid => 4269
      #t.geometry :path, :srid => 4269
      t.boolean :sense_way
      t.string :price
      t.string :station

      t.timestamps
    end

    change_table :routes do |t|
      t.index :path, :spatial => true
    end
  end
end
