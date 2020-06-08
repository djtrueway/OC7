/**
 * [Restaurant description]
 */

const dataManager = new DataHandler("ocP7klqsLql");
dataManager.importData("./data.json");


function initmap(){
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
            $('#button_add').click(function(){
                addRestau($('#lat').val(), $('#long').val(), $('#nom').val(), $('#score').val(), $('#add_comment').val() )
            })
            $('#search_restau').click(function(){
                addRestauFromGoogleMapApi()
            })
        } else {
        /* la géolocalisation n'est pas disponible */
        alert("la géolocalisation n'est pas disponible")
    }    
}

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
    data.forEach(e => {
        addMarker(e.lat, e.long)
    })

    for (let index = 0; index < dataManager.data.length; index++) {
        let tmp = new Restaurant(dataManager.data[index]);
    }
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
        &key=AIzaSyD6wzc3Dt0s52UvU58e_iScfPAsc0qjlsY&signature=wBRD9N8gsy7COpHeYN-zW_Z3e_8=`,
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

function addRestauFromGoogleMapApi(){
    if($('#search').val() === ''){
        $('.alert').addClass("alert alert-warning alert-dismissible fade show")
        return;
    }else{
        $('.alert').removeClass("alert alert-warning alert-dismissible fade show").addClass('alert alert-warning alert-dismissible fade hide')
    }
    let input =  $('#search').val()

    input = input.split(' ').join('+');
    console.log(input)

    let output = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${input}&key=`
    console.log(output)

    dataManager.importFromGoogle('./search.json')

    console.log(dataManager.data)

    for (let index = 0; index < dataManager.data.length; index++) {
        const element = dataManager.data[index];
        createRestau(element)
    }

} 

function createRestau(datas){
    console.log(datas)

    data = {
        "restaurantName": datas.name,
        "lat": datas.geometry.location.lat,
        "long":datas.geometry.location.lng,
        "ratings":[
           {
              "stars":datas.rating,
              "comment": ''
           }
        ]
     }
    let tmp = new Restaurant(data);
    return tmp;
}
