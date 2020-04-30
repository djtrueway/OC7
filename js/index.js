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
        } else {
        /* la géolocalisation n'est pas disponible */
        alert("la géolocalisation n'est pas disponible")
    }
})

/** display map and user position  */

function mapDisplay(lat, long , data=[]){

    mymap = L.map('map').setView([lat, long], 15);

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
                addMarker(tmp.lat, tmp.long, tmp.name, tmp.comments)
            }
        },
        error : function(resultat, statut, erreur){
          alert('Error statut : '+ statut +' '+ erreur)
        }
  
    });
   
}

function addMarker (lat, long, text, comment){
    var marker = L.marker([lat, long]).addTo(mymap).on('click', (e) =>{
        addGoogleStreetView(e.latlng.lat, e.latlng.long)
    });
    let msg = '<b>'+ text + '<b>'+'<br><br>'+' '+ comment
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



restau = jdata
           var i = 0;
           let star_1 = new Array();
           let count = []
           restau.forEach(e =>{
                let = element =  $('<li></li>').attr('class', 'list-group-item')
                $('ul').append(element)
                $('li')[i].innerText = e.restaurantName
                e.ratings.forEach(i =>{
                    const reducer = (accumulator, currentValue) => accumulator + currentValue;
                    star_1.push(i.stars)
                    count.push(star_1.reduce(reducer))
                    alert('reducer ' +count)
                    addMarker(e.lat, e.long, e.restaurantName, i.comment)
                })
                i++;
        })

**/