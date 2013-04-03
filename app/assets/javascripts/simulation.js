
    var markers_bus = [];
    var simulate_interval;

// ----------------------------------------------------------------------

    /*
    *   Object marker
    */ 
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

// ----------------------------------------------------------------------

    
    addMarker = function(number){
        for(i = 0; i < number; i++){
            var marker_simulator = new MarkerSimulator();
            marker_simulator.direction = i%2;
            marker_simulator.id = i;
            markers_bus.push(marker_simulator);
        }
    }
    addMarker(10);

// ----------------------------------------------------------------------

    /*
    *   Simulates the marker on the map
    *
    *   @param data array of coordinate
    *   @param distance_between_bus distance in points
    *   @param time reload time markers in miliseconds
    */
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
                markers_bus[k].indexPointInRout += 10;
                markers_bus[k].verifyIndexPointInRoute(coord_marker[markers_bus[k].direction].length);
            }       
        },time);
        
    }