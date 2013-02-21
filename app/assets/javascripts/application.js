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

$.widget("custom.catcomplete", $.ui.autocomplete, {
  _renderMenu: function( ul, items ) {
    var that = this;
    var currentCategory = "";
    $.each( items, function( index, item ) {
      if ( item.category != currentCategory ) {
        ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        currentCategory = item.category;
      }
      that._renderItem( ul, item );
    });
  }
});


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

    var i = 0, j = 0, iterator = 0;//iterator é usado para os marcadores de endereço
    var map,
        icon_point = '/ponto.png',
        imageuser = '/userlocation.png',
        coord_stops = [],
        marker_stops = [],
        marker_arrow = [],
        markerUser,//marcador da localização do usuário
        coord_route = [[]],
        polyline_route = [],
        color_route =["#636af2", "#0c1290"],    
        fortaleza = new google.maps.LatLng(-3.728394,-38.543395),
        place,//endereço pesquisado
        autocompleteAddress,//autocompleta endereços
        marker_autocomplete = [],// marcador do autocomplete de endereços
        id_search_address,//id do campo de busca por endereço
        directionsService = new google.maps.DirectionsService();

    
    initialize = function(){
      
      
      directionsDisplay = new google.maps.DirectionsRenderer();

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
      directionsDisplay.setMap(map);

      
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

    };

    setArrow = function(linhas){
        
          var r = 0;
          for(l=0;l<linhas.length;++l)
          {
            var linha=linhas[l];
            for(var s=0;s<linha.length;s+=15,++r)
            {
              
              var dir=((Math.atan2(linha[s+1].lng()-linha[s].lng(),linha[s+1].lat()-linha[s].lat())*180)/Math.PI)+360,
                  ico=((dir-(dir%3))%120);
              
              marker_arrow[r] = new google.maps.Marker({
                position: linha[s],
                map: map,
                icon: new google.maps.MarkerImage('http://maps.google.com/mapfiles/dir_'+ico+'.png',
                                                    new google.maps.Size(24,24),
                                                    new google.maps.Point(0,0),
                                                    new google.maps.Point(12,12)
                                                  )              
            });
            }
          }
        

      
    };

        

    cleanMap = function(structure){
        if (structure) {
            for (i in structure) {
              structure[i].setMap(null);
            }
        }
    };

    //Verifica a localização do usuário a cada 1 segundo
    locationUser = function(){
        markerUser.setPosition(null);
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
        var content = '<p style="text-align:center;">Sua localização não foi encontrada :( <br>Podemos oferecer mais recursos se você ativar sua localização.</p>';
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
    };//===========================================================================================

    initialize();


    //Lista as rotas que passam em um dados ponto
    listRoutes = function(data){
        
        if (data.length == 0){
          openError();
        }

        if( id_search_address == "search_address"){
          $("#destination").val(place.address_components[0].long_name+", "+place.address_components[1].long_name+", "+place.address_components[2].long_name);
        };
        $("#table_div").empty();// apaga uma lista de rotas que já estavam na coluna esquerda
        $("#table_div").append("<h5>Itinerários</h5>");
        $.each(data, function( event, item ) {
            $("#table_div").append("<tr><td class='btn-link link_route' value="+item.cod_route+"><span>" + item.name_route + "</span></td></tr>");
        });
    };//===========================================================================================

    setMarkerAddress = function(){

        // BUG? place.geometry por hora não é reconhecido pelo console do navegador 
        if (!place.geometry) {
          // Inform the user that the place was not found and return.
          openError("address");
          $(".address-error").alert();
          return;
        }
        
        cleanMap(polyline_route);//apaga a rota que estiver plotada no mapa
        cleanMap(marker_arrow);//apaga as setas que estiverem plotadas no mapa


        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          closeError("address");
          closeError();
          map.fitBounds(place.geometry.viewport);
        } else {
          closeError("address");
          closeError();
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }

        marker_autocomplete[iterator] = new google.maps.Marker({
          position: place.geometry.location,
          map: map,
          draggable: true,
          icon: '/marker_green'+iterator+'.png'

        });

        if (marker_autocomplete[0] && marker_autocomplete[1]) { 
          
          var location_origin = marker_autocomplete[0].position;
          var location_destin = marker_autocomplete[1].position;     
          
          var bordas_location = new google.maps.LatLngBounds();
          bordas_location.extend(location_origin);
          bordas_location.extend(location_destin);
          map.fitBounds(bordas_location);
          $.getJSON("home/routes-bytwo-point/?point="+location_origin.gb+","+location_origin.hb+","+location_destin.gb+","+location_destin.hb,listRoutes);
          
        } else {
          var location_point = place.geometry.location;
          $.getJSON("home/routes-by-point/?point="+location_point.gb+","+location_point.hb,listRoutes);  
        }
    };//===========================================================================================

    //google.maps.event.addListener(marker_autocomplete, 'dragend', function() { alert('marker dragged'); } );
    


    //Procura as rotas que passam em um dado ponto
    searchRoutesPoint = function(){
      //var icon_marker = '/marker_green'+iterator+'.png';
      google.maps.event.addListener(autocompleteAddress, 'place_changed', function() {
        if(marker_autocomplete[iterator]){
          marker_autocomplete[iterator].setMap(null);
        }
        place = autocompleteAddress.getPlace();
        setMarkerAddress();
      });
    };//===========================================================================================

    //Autocomplete de Rotas ========================================================

    setElement = function(element){

      id_search_address = element.id;

      if(id_search_address == "origin"){
        iterator = 0;
      }
      else{
        iterator = 1;
      }
      
      autocompleteAddress = new google.maps.places.Autocomplete(element);
      autocompleteAddress.bindTo('bounds', map);
      searchRoutesPoint();
    }
    
    //FIM Autocomplete de Rotas ===========================================================

    printStopMap = function(data){    
        for (i in data) {
            coord_stops[i] = new google.maps.LatLng(data[i][0], data[i][1]);                
            marker_stops[i] = new google.maps.Marker({
              position: coord_stops[i],
              map: map,
              icon: icon_point                  
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
    };

    google.maps.event.addListener(map, 'idle', boundsMap);

    /*updateUrl = function(params){
        
        local_url = window.location.href;
        window.location.href = null;
        window.location.href = local_url + '?' + params;
    }*/

    printRoute = function(data){
        //updateUrl('tutum=')

        //bordas armazena as bordas das polilinhas
        //essa informação é usada para centralizar o mapa

        closeError("address");
        closeError();

        var bordas = new google.maps.LatLngBounds();
        
        cleanMap(polyline_route);//apaga as rotas que estiverem plotada na tela
        cleanMap(marker_arrow);//apaga as setas que estiverem plotadas na tela

              
        coord_route = [[],[]];
        for(i in data){
            for(j in data[i]){
                lat = data[i][j][0];
                lng = data[i][j][1];
                coord_route[i][j] = new google.maps.LatLng(lat, lng);
                //bordas.extend e bordas.getCenter são métodos para encontrar o centro das rotas
                bordas.extend(coord_route[i][j]);                
            }
        }
        for (i=0; i < data.length; ++i) {
            polyline_route[i] = new google.maps.Polyline({
                path: coord_route[i],
                strokeColor: color_route[i],
                strokeOpacity: 1.0,
                strokeWeight: 3
            });

            polyline_route[i].setMap(map);//plota as rotas no mapa
            
        }

        map.fitBounds(bordas);//centraliza a rota no mapa

        var request = {
            origin:coord_route[0][0], 
            destination:coord_route[0][coord_route[0].length-1],
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        setArrow(coord_route);

        // use simulation.js
        marker_simulate(data, 18, 3000);
    }  

    // -------------------------------------------------------------------
  
    var MarkerSimulator = function(){
        this.id = 0;
        this.ordination = true;
        this.direction = 0;
        this.marker = new google.maps.Marker({
                                map: map,
                                draggable: false
                             });
        this.indexPointInRout = 0;
        this.verifyIndexPointInRoute = function(routeLength){
            if(this.indexPointInRout >= routeLength){
                this.indexPointInRout = 0;
                this.direction = this.direction == 0 ? 1 : 0;
            }
        };
    }

    // ------------------------------------------------------------------

    var markers_bus = [];
    var simulate_interval;
    
    addMarker = function(number){
        for(i = 0; i < number; i++){
            var marker_simulator = new MarkerSimulator();
            marker_simulator.direction = i%2;
            marker_simulator.id = i;
            markers_bus.push(marker_simulator);
        }
    }
    addMarker(10);


    marker_simulate = function(data, distance_between_bus, time){

        var coord_marker = [[],[]];
        
        for(i=0; i < data.length; i++){
            for(j=0; j < data[i].length; j++){
                lat = data[i][j][0];
                lng = data[i][j][1];
                coord_marker[i][j] = new google.maps.LatLng(lat, lng);
            }
        }

        clearInterval(simulate_interval);
        
        // defines indexes
        for(k=0; k<markers_bus.length; k++){
            markers_bus[k].indexPointInRout = distance_between_bus*k;
            markers_bus[k].verifyIndexPointInRoute(coord_marker[markers_bus[k].direction].length);
        }

        simulate_interval = setInterval(function(){
            for(k=0; k<markers_bus.length; k++){
                markers_bus[k].marker.setPosition(coord_marker[markers_bus[k].direction][markers_bus[k].indexPointInRout]);
                markers_bus[k].indexPointInRout++;
                markers_bus[k].verifyIndexPointInRoute(coord_marker[markers_bus[k].direction].length);
            }       
        },time);
        
    }

    requestCoordRoute = function(id){
      $.getJSON("/home/coord-route/"+id,printRoute);
    }
    
    /*$("#search_route").autocomplete({
        source: "/home/name-route",
        minLength: 2,
        autoFocus: true,
        
        select: function( event, ui ) {
            //updateUrl(ui.item.id+"-fortaleza")            
            requestCoordRoute(ui.item.id)
        }

    });*/
    


    /*path = $.url().attr().query.split('=')[1]
    if(path != '') {
        console.log(path)
        $.getJSON("/home/coord-route/"+path, printRoute)
    }
    */

    $('#search_route').catcomplete({
     
      source: function( request, response ) {
                var term = request.term;
                /*if ( term in cache ) {
                  response( cache[ term ] );
                  return;
                }*/

                console.log("teste: "+request.term);
                //getValueAdress(term);

                $.getJSON("/home/name-route?term="+term, request, function(data, status, xhr){
                    
                    console.log("json: "+data);
                    response( data );
                });

                $.getJSON("http://maps.googleapis.com/maps/api/place/queryautocomplete/json?&key=AIzaSyBY5FfsGNXeQ7nCrlwkqdV1yJbpaMpCgWA&sensor=false&input="+term,request, function(data, status, xhr){
                    console.log("json endereço: "+data);
                });

            },
      minLength: 2,
      autoFocus: true,
      
      select: function( event, ui ) {
          requestCoordRoute(ui.item.id);
      }
    });
    
    //Verifica a localização do usuário a cada 1 segundo
    window.setInterval(locationUser, 4000);

    changeMapSize = function() {
        var centerMap = map.getCenter();
        google.maps.event.trigger(map, "resize")
        map.setCenter(centerMap);
    };

    

    openError = function(errortype){
      if(errortype == "address"){
        $(".address-error").css({visibility: "visible"});
      }else{
        $(".search-error").css({visibility: "visible"});
      }
    };

    closeError = function(errortype){
      if(errortype == "address"){
        $(".address-error").css({visibility: "hidden"});
      }else{
        $(".search-error").css({visibility: "hidden"});
      }
    };

    closeColumn = function(){
      $("#info-column").css({visibility: "hidden"});
      $("#open-column").css({visibility: "visible"});
      $("#form-destination").css({visibility:"hidden"})
      $("#main_map").css({left:"0px"});       
      changeMapSize();
    };

    openColumn = function(){
      $("#info-column").css({visibility: "visible"});
      $("#open-column").css({visibility: "hidden"});
      $("#form-destination").css({visibility:"visible"})
      $("#main_map").css({left:"380px"});
      changeMapSize();
      
    };
    

});


