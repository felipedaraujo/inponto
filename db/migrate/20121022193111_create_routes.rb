class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.string :cod_route
      t.string :name_route
      #t.string :poly_desc
      t.line_string :path, :srid => 4269
      #t.line_string :path, :srid => 3785
      t.boolean :sense_way
      t.string :price

      t.timestamps
    end
  end
end
