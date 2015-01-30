class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.boolean     :sense_way
      t.line_string :path, :geographic => true
      t.string      :cod_route
      t.string      :name_route
      t.string      :station

      t.timestamps
    end

    change_table :routes do |t|
      t.index :path, :spatial => true
    end
  end
end
