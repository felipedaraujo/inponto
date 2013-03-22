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

var i = 0, j = 0, iterator = 0;//iterator é usado para os marcadores de endereço
var autocompleteAddress,//autocompleta endereços
    color_route =["#636af2", "#0c1290"],
    icon_station = '/marker_blue.png',
    map,
    marker_arrow = [],
    markerStation,
    marker_position = [],// marcador do autocomplete de endereços
    place,//endereço pesquisado
    polyline_route = [];


$.widget("custom.catcomplete", $.ui.autocomplete, {
  _renderMenu: function( ul, items ) {
    var that = this;
    var currentCategory = "";
    $.each( items, function( index, item ) {
      if ( item.category != currentCategory ) {

        ul.removeClass("ui-menu ui-widget").addClass("autocomplete");
        //ul.append( "<li class='category'><b>" + item.category + "</b></li>" );
        currentCategory = item.category;
      }
      that._renderItem( ul, item );
    });
  }
});

$(document).ready(function(){

    //Verifica o tamanho da tela e atribui o tamanho do campo de busca adequado
    if ($(window).width() > 767){
      $(".main-input")
        .removeClass("span3")
        .addClass("span5");
        $("#info-column").css("width","466px");
    }else{
      $(".main-input")
        .removeClass("span5")
        .addClass("span3");
      $("#info-column").css("width","290px");
    }

    if ($(window).width() < 481){
      $(".brand").css("display","none");
    }

    $("#itinerary-btn").click(function() {
      $("#getting-btn").removeClass("active");
      $("#itinerary-btn").addClass("active");
      closeDestination();
    });

    $("#getting-btn").click(function() {
      $("#itinerary-btn").removeClass("active");
      $("#getting-btn").addClass("active");
      $("#input-route").css("display", "none");
      $("#origin").css("display", "inline");
      $("#origin").focus();
    });

    $(".close-column").click(function() {
      closeColumn();
    });

    $(".open-column").click(function(){

      if ($("#info-column").css("display") == "none"){
        openColumn();
      }else{
        closeColumn();
      }
      
    });

    $(".link_route").live('click', function () {
      requestCoordRoute($(this).attr("value"));
    });

    $(".close-error").click(function(){
      closeError("address");
      closeError();

    });

    //Twitter Shared
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    
    //GooglePlus Shared
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // Create a div to hold the control.

    var icon_point = '/pointstop.png',
        imageuser = '/userlocation.png',
        coord_stops = [],
        marker_stops = [],
        markerUser,//marcador da localização do usuário
        coord_route = [[]],
        fortaleza = new google.maps.LatLng(-3.728394,-38.543395),
        
        id_search_address,//id do campo de busca por endereço
        directionsService = new google.maps.DirectionsService();

    
    initialize = function(){

      directionsDisplay = new google.maps.DirectionsRenderer();

      var styleMap =[
        {
          "featureType": "landscape.natural",
          "stylers": [
            { "color": "#f2e205" },
            { "lightness": 85 }
          ]
        },{
          "featureType": "water",
          "stylers": [
            { "color": "#048d64" }
          ]
        },{
        }
      ];

      var mapOptions = {
          zoom: 14,
          minZoom:10,
          styles: styleMap,
          //center: fortaleza,
          panControl: false,
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.SMALL, 
            position: google.maps.ControlPosition.RIGHT_TOP 
          },
          mapTypeControl: false,          
          mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      
      map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
      directionsDisplay.setMap(map);
      
      //Primeira captura da localização
      /*if(navigator.geolocation) {
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
      }*/ //else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      //}
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
    };

    //Nofica o usuário caso a localização não seja identificada
    handleNoGeolocation = function(errorFlag) {      
      /*if (errorFlag) {
        var content = '<p style="text-align:center;">Você terá mais recursos</br> se ativar sua localização.</p>';
      } else {
        var content = 'Erro: Seu browser não suporta geolocalização.';
      }*/
      var options = {
        map: map,
        position: fortaleza,
        //content: content
      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);
    };

    initialize();
    
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
        //captura a área visualizada e plota somente as paradas da visualização atual
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

    $('.search_route').catcomplete({
     
      source: "/home/name-route",
      minLength: 2,      
      select: function( event, ui ) {
          
          requestCoordRoute(ui.item.id);
      }
    });
    
    //Verifica a localização do usuário a cada 1 segundo
    //window.setInterval(locationUser, 4000);

});

//Ao redimensionar a tela::
//Verifica o tamanho da tela e atribui o tamnho do campo de busca adequado
$(window).resize(function(){
    
    $(".brand").css("display","block");
    if ($(".control-destination").css("display") == "none"){
      $("#main_map").css("top","54px");
    }else{
      $("#main_map").css("top","90px");
    }

    if ($(window).width() > 767){
      $(".main-input")
        .removeClass("span3")
        .addClass("span5");
      $("#info-column").css("width","466px");
    }else{
      $(".main-input")
        .removeClass("span5")
        .addClass("span3");
      $("#info-column").css("width","290px");
    }

    if ($(window).width() < 481){
      $(".brand").css("display","none");
      if ($(".control-destination").css("display") == "none"){
        $("#main_map").css("top","49px");
      }else{
        $("#main_map").css("top","85px");
      }
    }
});

function openError(errortype){
  
  if(errortype == "address"){
    $(".address-error").css({display: "block"});
  }else{
    $(".search-error").css({display: "block"});
  }
};

function closeError(errortype){
  if(errortype == "address"){
    $(".address-error").css({display: "none"});
  }else{
    $(".search-error").css({display: "none"});
  }
};


function openColumn(){
  if($("#info-column").css("display") == "none"){
    $("#info-column").slideToggle('slow');
    $(".open-column").addClass("active");
    $(".open-icon").removeClass("icon-chevron-down").addClass("icon-chevron-up");
  }
};

function closeColumn(){
  if($("#info-column").css("display") == "block"){
    $("#info-column").slideToggle('slow',function(){
      $(".open-column").removeClass("active");  
      $(".open-icon").removeClass("icon-chevron-up").addClass("icon-chevron-down");
    });
  }
  
  
};


function openDestination(){
  $(".control-destination").css("display",function(){
    if ($(window).width() < 481){
      $("#main_map").css("top","85px");
    }else{
      $("#main_map").css("top","90px");
    }
    openColumn();
    return "block";
  });
  $("#destination").focus();
};

function closeDestination(){
  
  $("#main_map").css("top",function(){
    closeColumn();
    $("#destination").val("");
    $(".control-destination").css("display", "none");
    if ($(window).width() < 481){
      return "49px";
    }else{
      return "54px";
    }
  });
  $("#origin").val("").css("display", "none");
  $(".pac-container").remove();
  $("#input-route").css("display", "inline");
  $("#input-route").focus();

    
  for (var i = 0; i < marker_position.length; i++) {
    marker_position[i].setMap(null);
  };
  marker_position = [];
};

//Plota o terminalno mapa
function setStation(pos){
  if (marker_position[2]){
    marker_position[2].setMap(null);  
  }  
  pos_station = new google.maps.LatLng(parseFloat(pos.coord_desc.slice(6,-1).split(/ /g)[0]),
                                             parseFloat(pos.coord_desc.slice(6,-1).split(/ /g)[1]));
  marker_position[2] = new google.maps.Marker({
    position: pos_station,
    map: map,
    icon:icon_station,
    title: pos.next_to
  });
  
}

function listRoutes(data){

    // apaga uma lista de rotas que já estavam na coluna esquerda
    $("#table_div").empty();

    // identifica o json com rotas integradas ao terminal
    if(data[0][0]){
      
      setStation(data[0][0]);
      if (data[1].length >= data[2].length){
        $.each(data[1], function ( cont, element ){   
          $.each(data[2], function ( cont2, element2 ){
            $("#table_div").append('<tr><td class="btn-link link_route bus" value='+element.cod_route+' title="'+element.name_route+'"><img src="/bus.png"> <span>'+element.cod_route+'</span></td><td class="arrow"><i class="icon-arrow-right"></i></td><td class="station" title="'+data[0][0].next_to+'"><span><b>T</b><div class="icon- square-station"></div></span></td><td class="arrow"><i class="icon-arrow-right"></i></td><td class="btn-link link_route bus" value='+element2.cod_route+' title="'+element2.name_route+'"><img src="/bus.png"> <span>'+element2.cod_route+'</span></td></tr>');
          });
        });
      }else{
        $.each(data[2], function ( cont, element ){   
          $.each(data[1], function ( cont2, element2 ){
            $("#table_div").append('<tr><td class="btn-link link_route bus" value='+element.cod_route+' title="'+element.name_route+'"><img src="/bus.png"> <span>'+element.cod_route+'</span></td><td class="arrow"><i class="icon-arrow-right"></i></td><td class="station" title="'+data[0][0].next_to+'"><span><b>T</b><div class="icon- square-station"></div></span></td><td class="arrow"><i class="icon-arrow-right"></i></td><td class="btn-link link_route bus" value='+element2.cod_route+' title="'+element2.name_route+'"><img src="/bus.png"> <span>'+element2.cod_route+'</span></td></tr>');
          });
        });
      }
      openColumn();
    }else{
      console.log(data);
      if(data[1] == null){
        closeColumn();
        openError();
      }else{
        $.each(data, function( event, item ) {
          $("#table_div").append("<tr><td class='btn-link link_route' value="+item.cod_route+"><span>" + item.name_route + "</span></td></tr>");
        });
      }
      

      //Exibir o segundo campo de busca
      openDestination();
      
    }  
};

function setMarkerAddress(){

    // BUG? place.geometry por hora não é reconhecido pelo console do navegador 
    if (!place.geometry) {
      // Inform the user that the place was not found and return.
      alert("Égua!");
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

    marker_position[iterator] = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      draggable: true,
      icon: '/marker_green'+iterator+'.png'

    });

    /*google.maps.event.addListener(marker_position[iterator], 'dragend', function(event){ 
      console.log(event); 
    });*/

    if (marker_position[0] && marker_position[1]) { 
      
      var location_origin = marker_position[0].position;
      var location_destin = marker_position[1].position;     
      
      var bordas_location = new google.maps.LatLngBounds();
      bordas_location.extend(location_origin);
      bordas_location.extend(location_destin);
      map.fitBounds(bordas_location);
      $.getJSON("home/routes-bytwo-point/?point="+location_origin.kb+","+location_origin.lb+","+location_destin.kb+","+location_destin.lb,listRoutes);
      
    } else {
      var location_point = place.geometry.location;
      $.getJSON("home/routes-by-point/?point="+location_point.kb+","+location_point.lb,listRoutes);  
    }
};

//Procura as rotas que passam em um dado ponto
function searchRoutesPoint(){

  google.maps.event.addListener(autocompleteAddress, 'place_changed', function() {
    if(marker_position[iterator]){
      marker_position[iterator].setMap(null);
    }
    place = autocompleteAddress.getPlace();
    setMarkerAddress();
  });
};

//Autocomplete de Endereços 
function setElement(element){

  var city_options = {
    //types: ['(locality)'],
    componentRestrictions: {country: "br"}
  };

  id_search_address = element.id;

  if(id_search_address == "origin"){
    iterator = 0;
  }
  else{
    iterator = 1;
  }
  
  autocompleteAddress = new google.maps.places.Autocomplete(element, city_options);
  autocompleteAddress.bindTo('bounds', map);
  searchRoutesPoint();
};

function setArrow(linhas){
    
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

function printRoute(data){
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

  closeColumn();

  setArrow(coord_route);
}

function requestCoordRoute(id){
  $.getJSON("/home/coord-route/"+id,printRoute);
}


/*changeMapSize = function() {
    var centerMap = map.getCenter();
    google.maps.event.trigger(map, "resize")
    map.setCenter(centerMap);
};*/