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

ActiveRecord::Schema.define(:version => 20130204225859) do

  create_table "cities", :force => true do |t|
    t.column "name", :string
    t.column "cod_city", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
  end

  create_table "point_routes", :force => true do |t|
    t.column "point_id", :integer
    t.column "cod_route", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
  end

  create_table "point_stops", :force => true do |t|
    t.column "cod_point", :string
    t.column "next_to", :string
    t.column "route_point", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
    t.column "coord_desc", :point
  end

  create_table "routes", :force => true do |t|
    t.column "cod_route", :string
    t.column "name_route", :string
    t.column "sense_way", :boolean
    t.column "price", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
    t.column "path", :line_string, :srid => 4269
  end

  create_table "transports", :force => true do |t|
    t.column "cod_transpot", :string
    t.column "sense_way", :boolean
    t.column "accessibility", :boolean
    t.column "stocking", :integer
    t.column "coord_real_time", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
  end

  create_table "users", :force => true do |t|
    t.column "name", :string
    t.column "email", :string
    t.column "created_at", :datetime, :null => false
    t.column "updated_at", :datetime, :null => false
  end

end
