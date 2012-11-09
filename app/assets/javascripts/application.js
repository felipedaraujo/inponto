// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
$(document).ready(function(){

var map;

var mapOptions = {
	zoom: 14,
	center: new google.maps.LatLng(-3.728394,-38.543395),
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
 
//var pointStopLayer = new google.maps.KmlLayer('http://localhost:3000/home/kml');
var pointStopLayer = new google.maps.KmlLayer('http://inponto.com.br/cta.kml');
/*var pointStopLayer = new google.maps.KmlLayer('http://www.etufor.ce.gov.br/googleearth/pontos_de_paradas.kml');*/
/*var routeLayer = new google.maps.KmlLayer('http://www.etufor.ce.gov.br/googleearth/transporte_coletivo.kml');*/

pointStopLayer.setMap(map);
/*routeLayer.setMap(map);*/



});

