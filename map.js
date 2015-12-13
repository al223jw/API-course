"use strict";
var gmaps = 
{
  ConvertedCoordinates:[],
  
  map:{},
  //Creates a new worldmap zoomed out to see enough of the world.
  initMap:function() 
  {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:40,lng:0},
      zoom: 3
    });
  },
  
  //For each mail in mailarray start geocoding session that finishes by placing marker.
 geocodeAddress:function(mails) {
    var geocoder = new google.maps.Geocoder();
      for(var i=0; i < mails.length; i++)
      {
          gmaps.startGeocoding(mails[i],geocoder);
      }
  },
  
  //Gets the current mail in the array takes the correct information needed for the infolabel
  //Converts adress to geocoding and applies that to where the marker will be placed
  startGeocoding:function(currentmail,geocoder)
  {
      var currentlabel = currentmail.label;
      var currentsubject = currentmail.subject;
      var currentsnippet = currentmail.snippet;
      var currenttotalmail = currentmail.fullmail;
      
      var currentcutmail = currenttotalmail.substr(0,700) +"...";
      var adress = currentlabel;
      
      var newadress = adress.replace("Location","");
      geocoder.geocode({'address': newadress},
      function(results, status) 
      {
          if (status === google.maps.GeocoderStatus.OK)
          {
            var currentloc = results[0].geometry.location;
            gmaps.createMapMarker(currentloc,currentsnippet,currentsubject,currentlabel,currentcutmail);
          } 
          if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) 
          {
            setTimeout(function(){
                    gmaps.startgeocoding(currentmail,geocoder);
                }, 300);
          }
          if(status === google.maps.GeocoderStatus.ZERO_RESULTS)
          {
            console.log(newadress);
          }
      });
  },
  
  //Creates the marker with the mailinformation.
  createMapMarker:function(currentloc,currentsnippet,currentsubject,currentlabel,currenttotalmail)
  {
    var marker = new google.maps.Marker
    ({
      position: currentloc,
      map: this.map,
      title: currentlabel
    });
    
    var mapInfoWindow = new google.maps.InfoWindow
    ({
      content: '<div id="infocontent">'+
      '<h1 id="firstHeading" class="firstHeading">'+currentlabel+'</h1>'+
      '<div id="bodyContent">'+
      '<p>'+currentsnippet+'</p>'+
      '<br>'+
      '<p>'+currentsubject+'</p>'+
      '<br>'+
      '<p>'+currenttotalmail+'</p>'+
      '</div>'
    });
    
    
    //When hovering over the label it opens..
    marker.addListener('mouseover', function() 
    {
      mapInfoWindow.open(this.map, marker);
      disableAutoPan:true;
    });
  }
};