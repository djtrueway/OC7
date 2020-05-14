/**
 * [Restaurant description]
 */
$(function(){

    let myLatitide = null;
    let myLongitude = null;
    let mymap = null;
    let googleToken = 'AIzaSyCggw-r9vntpJDBsUx-rTyNevUzlqLlyew';
    

    if ("geolocation" in navigator) {
        /* la géolocalisation est disponible */
        navigator.geolocation.getCurrentPosition(function(position) {
            myLatitide = position.coords.latitude;
            myLongitude = position.coords.longitude;
            mapDisplay(myLatitide, myLongitude);
            })
            $('button').click(function(){
                addRestau($('#lat').val(), $('#long').val(), $('#nom').val(), $('#score').val(), $('#add_comment').val() )
            })
        } else {
        /* la géolocalisation n'est pas disponible */
        alert("la géolocalisation n'est pas disponible")
    }
})

/** display map and user position  */

function mapDisplay(lat, long , data=[]){

    mymap = L.map('map').setView([lat, long], 2);

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

    $.ajax({
        url: './data.json',
        type: "GET",
        dataType: "json",
        success: function (data) {
            for (let index = 0; index < data.length; index++) {
                let tmp = new Restaurant(data[index]);
                //addMarker(tmp.lat, tmp.long, tmp.name, tmp.comments)
                // showStart()
            }
        },
        error : function(resultat, statut, erreur){
          alert('Error statut : '+ statut +' '+ erreur)
        }
  
    });

    mymap.on('click', onMapClick);
   
}

function addMarker (lat, long, text){
    var marker = L.marker([lat, long]).addTo(mymap).on('click', (e) =>{
        addGoogleStreetView(e.latlng.lat, e.latlng.long)
    });
    let msg = '<b>'+ text + '<b>'+'<br><br>'
    marker.bindPopup(msg);
}

function addGoogleStreetView(lat, long){
    $.ajax({
        url : `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${lat},${long}
        &fov=80&heading=70&pitch=0
        &key=AIzaSyCggw-r9vntpJDBsUx-rTyNevUzlqLlyew`,
        type : 'GET',
        success : function(data){
            alert(data)
        },
        error : function(resultat, statut, erreur){
            alert('Error statut : '+ statut + ' '+ erreur)
        }
    })
}

window.addGoogleStreetView = addGoogleStreetView


/** get position when user click on the map */
function onMapClick(e) {
    document.getElementById('lat').value=e.latlng.lat;
    document.getElementById('long').value=e.latlng.lng;
}

/** add restaurant on the map */
function addRestau (lat, long, nom, score, comment) { 
    if((lat === '') && (long === '') && (nom === '')) return alert("bad input")

    data = {
        "restaurantName": nom,
        "lat": lat,
        "long":long,
        "ratings":[
           {
              "stars":score,
              "comment": comment
           }
        ]
     }
    let newRestaurant = new Restaurant(data) ;

    $('#lat').val('');
    $('#long').val('');
    $('#nom').val('');
    $('#score').val('');
    $('#add_comment').val('');
}
