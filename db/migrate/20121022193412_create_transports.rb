class CreateTransports < ActiveRecord::Migration
  def change
    create_table :transports do |t|
      t.boolean :sense_way
      t.boolean :accessibility
      t.integer :stocking
      t.string  :cod_transpot
      t.string  :coord_real_time

      t.timestamps
    end
  end
end
