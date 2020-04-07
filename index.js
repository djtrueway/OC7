$(function(){

    let myLatitide = null;
    let myLongitude = null;
    let mymap = null;
    let Restau = [];
    

    $.ajax({
        url: 'data.json',
        type: "GET",
        dataType: "json",
        success: function (jdata) {
           Restau = jdata
           Restau.forEach(e =>{
                addMarker(e.lat, e.long, e.restaurantName)
        })
        },
        error : function(resultat, statut, erreur){
          alert('Error statut : '+ statut + ' '+ erreur)
        }
  
    });

    

    if ("geolocation" in navigator) {
        /* la géolocalisation est disponible */
        navigator.geolocation.getCurrentPosition(function(position) {
            myLatitide = position.coords.latitude;
            myLongitude = position.coords.longitude;
            mapDisplay(myLatitide, myLongitude);
        });
    } else {
        /* la géolocalisation n'est pas disponible */
        alert("la géolocalisation n'est pas disponible")
    }
})

/** display map and user position  */

function mapDisplay(lat, long , data=[]){

    mymap = L.map('map').setView([lat, long], 8);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGp0cnVld2F5IiwiYSI6ImNrODRvbHBqcTAxbXUzZnBleXR0cnQ0d2oifQ.PkWU4kpbQBnHCBkmTNHYtA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGp0cnVld2F5IiwiYSI6ImNrODRvbHBqcTAxbXUzZnBleXR0cnQ0d2oifQ.PkWU4kpbQBnHCBkmTNHYtA'
    }).addTo(mymap);
    addMarker(lat, long, 'je suis peterson')
    data.forEach(e =>{
        addMarker(e.lat, e.long)
    })
   
}

function addMarker (lat, long, text){
    var marker = L.marker([lat, long]).addTo(mymap);
    marker.bindPopup(text).openPopup();
}




/**

var circle = L.circle([48.8737815, 2.3501649], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

circle.bindPopup("I am a circle.").openPopup();

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng.lat);
}

//mymap.on('click', onMapClick);

**/