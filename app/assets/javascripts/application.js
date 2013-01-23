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

//Twitter Sheared




$(document).ready(function(){



    //Twitter Shared
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    
    //GooglePlus Shared
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // Create a div to hold the control.

    var i = 0, j = 0;
    var map;
    var image = '/ponto.png';
    var imageuser = '/userlocation.png';
    var coord_stops = [];
    var marker_stops = [];
    var coord_route = [[]];
    var polyline_route = [];
    var markerUser;//marcador da localização do usuário
    var color_route =["#228B22", "#7CFC00"];    
    var fortaleza = new google.maps.LatLng(-3.728394,-38.543395);
    var place;//endereço pesquisado

    
    initialize = function(){
      
      //$("#map_canvas").width($("#map_canvas").width()-380);

        var mapOptions = {
            zoom: 14,
            minZoom:10,
            //center: fortaleza,
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

        
        //Primeira captura da localização
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);

            
            markerUser = new google.maps.Marker({
              map: map,
              icon:imageuser
            });
            
            markerUser.setPosition(pos);
            map.setCenter(pos);
            map.setZoom(17);
          }, function() {
            handleNoGeolocation(true);
          });
        } else {
          // Browser doesn't support Geolocation
          handleNoGeolocation(false);
        }

    }
        

    cleanMap = function(structure){
        if (structure) {
            for (i in structure) {
              structure[i].setMap(null);
            }
        }
    };

    //Verifica a localização do usuário a cada 1 segundo
    locationUser = function(){
        markerUser.setPosition(null)
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);

            markerUser = new google.maps.Marker({
              map: map,
              icon:imageuser
            });
            
            markerUser.setPosition(pos);
            
          }, function() {
            handleNoGeolocation(true);
          });
        } else {
          // Browser doesn't support Geolocation
          handleNoGeolocation(false);
        }


    }

    //Nofica o usuário caso a localização não seja identificada
    handleNoGeolocation = function(errorFlag) {
      if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
      } else {
        var content = 'Erro: Seu browser não suporta geolocalização.';
      }

      var options = {
        map: map,
        position: fortaleza,
        content: content

      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);
    }

    initialize();


    //Lista as rotas que passam em um dados ponto
    listRoutes = function(data){
                
        $("#form-destination").css({visibility:"visible"})
        console.log(place.address_components);
        $("#destination").val(place.address_components[0].long_name+", "+place.address_components[1].long_name+", "+place.address_components[2].long_name);
        $("#table_div").empty();

        $.each(data, function( event, item ) {

            $("#table_div").append("<tr><td class='btn-link' id='link_route' value="+item.cod_route+">" + item.name_route + "</td></tr>");

        });

    };
    google.maps.event.trigger(map, "resize");


    //Procura as rotas que passAstux - Avenida Dom Luís, Fortaleza - Ceara, Brazilam em um dado ponto
    searchRoutesPoint = function(){
  
      google.maps.event.addListener(autocompleteAddress, 'place_changed', function() {
        var markerAutocomplete = new google.maps.Marker({
          map: map
        });
        markerAutocomplete.setVisible(true);
        //input.className = '';
        place = autocompleteAddress.getPlace();
        console.log(place);
        
        if (!place.geometry) {
          // Inform the user that the place was not found and return.

          openError();
          $(".address-error").alert();
          return;

        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          closeError();
          map.fitBounds(place.geometry.viewport);
        } else {
          closeError();
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
        markerAutocomplete.setPosition(place.geometry.location);
        
        var locationPoint = place.geometry.location;

        //point= locationPoint.Za+","+locationPoint.$a
        //point = locationPoint
        //console.log(point)

        $.getJSON("home/routes-by-point/?point="+locationPoint.Za+","+locationPoint.$a,listRoutes);
        //$.getJSON("home/routes-by-point/"+point,listRoutes);

      });

    }

    //Autocomplete de Rotas ========================================================

    
    var input = document.getElementById('search_address');

    var autocompleteAddress = new google.maps.places.Autocomplete(input);
    //console.log(autocompleteAddress);
    autocompleteAddress.bindTo('bounds', map);
    searchRoutesPoint();

    //FIM Autocomplete de Rotas ===========================================================

    

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
        
        local_url = window.location.href;
        window.location.href = null;
        window.location.href = local_url + '?' + params;
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

    requestCoordRoute = function(id){
      //alert("Segunda verificação!")
      $.getJSON("/home/coord-route/"+id,printRoute);

    }
    
    
    $("#search_route").autocomplete({
        source: "/home/name-route",
        minLength: 2,
        autoFocus: true,
        
        select: function( event, ui ) {
            //updateUrl(ui.item.id+"-fortaleza")            
            //$.getJSON("/home/coord-route/"+ui.item.id,printRoute)
            requestCoordRoute(ui.item.id)
        }

    });
    


    /*path = $.url().attr().query.split('=')[1]
    if(path != '') {
        console.log(path)
        $.getJSON("/home/coord-route/"+path, printRoute)
    }
    */

    /*$.widget("custom.catcomplete", $.ui.autocomplete, {
      _renderMenu: function( ul, items ) {
        var self = this;
        //console.log(items);
        ul.append( "<li class='category'> Rotas </li>");
        $.each( items, function( index, item ) {
      
            self._renderItem( ul, {
              label: item.label
            });

        });
      }
    });


    $('#search_route').catcomplete({
     
      source: "/home/search",
      minLength: 2,
      autoFocus: true,
      
      select: function( event, ui ) {
          //updateUrl(ui.item.id+"-fortaleza")
          console.log(ui.item)         
          $.getJSON("/home/coord-route/"+ui.item.id,printRoute)
      }
    });*/
    
    //Verifica a localização do usuário a cada 1 segundo
    window.setInterval(locationUser, 4000);

    changeMapSize = function() {
        var centerMap = map.getCenter();
    
        google.maps.event.trigger(map, "resize")

        map.setCenter(centerMap);
        

    };

    openError = function(){
        $(".address-error").css({visibility: "visible"});
    };

    closeError = function(){
        $(".address-error").css({visibility: "hidden"});
    };

    closeColumn = function(){
      $("#info-column").toggle();
      $("#open-column").css({visibility: "visible"});
      $("#main_map").css({left:"0px"});       
      changeMapSize();
    };

    openColumn = function(){
      $("#info-column").toggle();
      $("#open-column").css({visibility: "hidden"});
      $("#main_map").css({left:"380px"});
      changeMapSize();
    };
    

});


