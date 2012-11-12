# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121112194945) do

  create_table "cities", :force => true do |t|
    t.string   "name"
    t.string   "cod_city"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "geometry_columns", :id => false, :force => true do |t|
    t.string  "f_table_catalog",   :limit => 256, :null => false
    t.string  "f_table_schema",    :limit => 256, :null => false
    t.string  "f_table_name",      :limit => 256, :null => false
    t.string  "f_geometry_column", :limit => 256, :null => false
    t.integer "coord_dimension",                  :null => false
    t.integer "srid",                             :null => false
    t.string  "type",              :limit => 30,  :null => false
  end

  create_table "point_routes", :force => true do |t|
    t.integer  "point_id"
    t.string   "cod_route"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

# Could not dump table "point_stops" because of following StandardError
#   Unknown type 'geometry' for column 'coord_desc'

# Could not dump table "routes" because of following StandardError
#   Unknown type 'geometry' for column 'path'

  create_table "spatial_ref_sys", :id => false, :force => true do |t|
    t.integer "srid",                      :null => false
    t.string  "auth_name", :limit => 256
    t.integer "auth_srid"
    t.string  "srtext",    :limit => 2048
    t.string  "proj4text", :limit => 2048
  end

  create_table "transports", :force => true do |t|
    t.string   "cod_transpot"
    t.boolean  "sense_way"
    t.boolean  "accessibility"
    t.integer  "stocking"
    t.string   "coord_real_time"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

end
