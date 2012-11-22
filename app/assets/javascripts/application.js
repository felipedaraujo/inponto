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

var map;
var image = 'http://inponto.com.br/pin.png';

var mapOptions = {
	zoom: 14,
	center: new google.maps.LatLng(-3.728394,-38.543395),
	mapTypeId: google.maps.MapTypeId.ROADMAP
};


map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);

var pointStopLayer = new google.maps.KmlLayer('http://inponto.com.br/ponto_teste.kml');

pointStopLayer.setMap(map);

//console.log($("#search_route_json").html().replace(/&quot;/gi,"\""));

var searchRouteJSON = $("#search_route_json").html().replace(/&quot;/gi,"\""),
        searchRoute = $.parseJSON(searchRouteJSON);

$( "#search_route" ).autocomplete({
    source: searchRoute
});
//tratamento de acentos no autocomplete
var accentMap = {
    "á": "a",
    "â": "a",
    "ã": "a",
    "Á": "A",
    "é": "e",
    "í": "i",
    "ó": "o",
    "ô": "o",
    "ú": "u",
    "ç": "c",
};

var normalize = function( term ) {
    var ret = "";
    for ( var i = 0; i < term.length; i++ ) {
        ret += accentMap[ term.charAt(i) ] || term.charAt(i);
    }
    return ret;
};

$( "#search_route" ).autocomplete({
    source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
        response( $.grep( searchRoute, function( value ) {
            value = value.label || value.value || value;
            return matcher.test( value ) || matcher.test( normalize( value ) );
        }) );
    }
});

//pesquisar por full text search


});

