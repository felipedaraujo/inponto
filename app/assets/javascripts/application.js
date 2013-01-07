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


    // Create a div to hold the control.

    var i = 0, j = 0;
    var map;
    //var image = 'http://inponto.com.br/pin.png';
    var image = '/ponto.png';
    var coord_stops = [];
    var marker_stops = [];
    var coord_route = [[]];
    var polyline_route = [];
    var color_route =["#228B22", "#7CFC00"];
    //var color_route =["#0000FF", "#EE0000"];
    var fortaleza = new google.maps.LatLng(-3.728394,-38.543395);

    

    var mapOptions = {
        zoom: 14,
        minZoom:10,
        center: fortaleza,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        panControl: true,
        panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL, 
          position: google.maps.ControlPosition.RIGHT_TOP 
        },
        
        mapTypeId: google.maps.MapTypeId.ROADMAP,

    };
    
    map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);

    //Procura as rotas que assam em um dado ponto
    searchRoutesPoint = function(){
      $.getJSON("/home/coord-route/"+ui.item.id,printRoute)


    }

    //Autocomplete de Rotas========================================================

    var input = document.getElementById('search_address');
    
    var autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.bindTo('bounds', map);



    var markerAutocomplete = new google.maps.Marker(
      {map: map}
    );

    google.maps.event.addListener(autocomplete, 'place_changed', function() {

      markerAutocomplete.setVisible(true);
      input.className = '';

      var place = autocomplete.getPlace();

      console.log(place.geometry.location);

      if (!place.geometry) {
        // Inform the user that the place was not found and return.
        input.className = 'notfound';
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geplace.geometry.locationometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }

      markerAutocomplete.setPosition(place.geometry.location);

      var address = '';
      if (place.address_components) {
        addrinputess = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

    });

    //FIM Autocomplete de Rotas ===========================================================

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

    updateUrl = function(params){
        
        local_url = window.location.href
        window.location.href = null
        window.location.href = local_url + '?' + params
    }

    printRoute = function(data){
        //updateUrl('tutum=')

        //bordas armazena as bordas das polilinhas
        //essa informação é usada para centralizar o mapa
        var bordas = new google.maps.LatLngBounds();
        
        cleanMap(polyline_route);

        coord_route = [[],[]];
        for(i in data){
            for(j in data[i]){
                lat = data[i][j][0];
                lng = data[i][j][1];
                coord_route[i][j] = new google.maps.LatLng(lat, lng);
                //bordas.extend e bordas.getCenter são métodos para encontrar o centro das rotas
                bordas.extend(coord_route[i][j]);
                bordas.getCenter();
            }
        }
        for (i=0; i < data.length; i++) {
            polyline_route[i] = new google.maps.Polyline({
                path: coord_route[i],
                strokeColor: color_route[i],
                strokeOpacity: 1.0,
                strokeWeight: 3
            });

            //polyline_route[i].setMap(map) plota as rotas no mapa
            polyline_route[i].setMap(map);
            //map.fitBounds(bordas) centraliza
            map.fitBounds(bordas);
        }
    }
    
    /*
    $("#search_route").autocomplete({
        source: "/home/search",
        minLength: 2,
        autoFocus: true,
        
        select: function( event, ui ) {
            //updateUrl(ui.item.id+"-fortaleza")            
            $.getJSON("/home/coord-route/"+ui.item.id,printRoute)
        }

    });
    


    path = $.url().attr().query.split('=')[1]
    if(path != '') {
        console.log(path)
        $.getJSON("/home/coord-route/"+path, printRoute)
    }
    */

    $.widget("custom.catcomplete", $.ui.autocomplete, {
      _renderMenu: function( ul, items ) {
        var self = this;
        console.log(items);
        ul.append( "<li class='category'> Rotas </li>");
        $.each( items, function( index, item ) {
      
            self._renderItem( ul, {
              label: item.label
            });

        });
      }
    });


    $('#search_route').catcomplete({
      
      /*source: function(request, response) {
        response(data);
      }*/

      source: "/home/search",
      minLength: 2,
      autoFocus: true,
      
      select: function( event, ui ) {
          //updateUrl(ui.item.id+"-fortaleza")
          console.log(ui.item)         
          $.getJSON("/home/coord-route/"+ui.item.id,printRoute)
      }
    });

});