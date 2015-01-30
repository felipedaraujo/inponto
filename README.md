inponto
=======
A non-official Google Maps public transport made in Ruby on Rails http://inponto.com/

To see the project working:

1) Access the link http://inponto.com/

2) Type in the search field "Avenida Beira Mar" and select the first option.

3) Type in the second search field "IFCE" and select the first option.

4) Now you have the public transportation options that pass between these two addresses.

This project was created to be the Google Maps public transport of Fortaleza, the 5th largest city of Brazil, that since January 9th has the official service of Google Maps.

Soon we will be offering to other cities in Brazil and the world that do not have Google Maps public transport such as Brasilia, Salvador, Recife, Natal, Manaus.


#### Database
To create and run a geographic databse you must do:

1) Run `rake db:create`

2) Access your postgres console `psql postgres`

3) Choose the database `\connect inponto_dev`

4) Add the postgis extension `CREATE EXTENSION postgis;`

5) Run `rake db:migrate`

6) Populate the database with data from Fortaleza `rake data:fortaleza`
