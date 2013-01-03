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
//= require_tree
//= require jquery-ui

$(document).ready(function(){

    var i, j;
    var map;
    //var image = 'http://inponto.com.br/pin.png';
    var image = '/ponto.png';
    var coord_stops = [];
    var marker_stops = [];
    var coord_route = [[]];
    var polyline_route = [];

    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(-3.728394,-38.543395),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom:10
    };
    
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);

    cleanMap = function(structure){
        if (structure) {
            for (i in structure) {
              structure[i].setMap(null);
            }
        }
    };

    printStopMap = function(data){    
        for (i in data) {
            coord_stops[i] = new google.maps.LatLng(data[i][0], data[i][1]);                
            marker_stops[i] = new google.maps.Marker({
              position: coord_stops[i],
              map: map,
              icon: image                  
            });   
        }            
    };

    boundsMap = function(){
        //O ideal seria ultilizar cookie nessa função, para que as paradas que já estão plotadas
        //não precisem ser plotadas novamentes
        cleanMap(marker_stops);
        if (map.getZoom() >= 16){
            northEastLat = map.getBounds().getNorthEast().lat();
            northEastLon = map.getBounds().getNorthEast().lng();
            southWestLat = map.getBounds().getSouthWest().lat();
            southWestLon = map.getBounds().getSouthWest().lng();
            $.getJSON("/home/point-stop/?bounds="+northEastLat+","+northEastLon+","+southWestLat+","+southWestLon,printStopMap);
        }
        /*else{
            cleanMap();
        }*/
    };

    google.maps.event.addListener(map, 'idle', boundsMap);

    //var pointStopLayer;
    //for (var i = 1; i <= 2; i++) {
    //var pointStopLayer = new google.maps.KmlLayer("http://inponto.com/imports/point_layer_part02-min.kml");
    //pointStopLayer.setMap(map);
    //};
    //var pointStopLayer = new google.maps.KmlLayer('http://www.etufor.ce.gov.br/googleearth/pontos_de_paradas.kml');

    printRoute = function(data){
        //console.log(data.length);
        //console.log(data[0].length);
        //console.log(data[1].length);
        for(i = 0 ; i < data.length ; i++){

        //for(i in data){
            //console.log(coord_route[j]);
            for(j = 0 ; data[i].length ; j++){
            //for(j in data[i]){
                coord_route[i][j] = new google.maps.LatLng(data[i][j][0], data[i][j][1]);
                //console.log(coord_route[i]);
            }
            
            polyline_route[i] = new google.maps.Polyline({
                path: coord_route[i],
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 2
            });
            polyline_route[i].setMap(map);
        }

        
    }

    $("#search_route").autocomplete({
        source: "/home/search",
        minLength: 2,
        autoFocus: true,
        select: function( event, ui ) {            
            $.getJSON("/home/coord-route/"+ui.item.id,printRoute)
        }
    });



});





