/**
 * [Restaurant description]
 */

const dataManager = new DataHandler("ocP7klqsLql");
dataManager.importData("./data.json");


function initmap(){
    let myLatitide = null;
    let myLongitude = null;
    let mymap = null;
    

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

function mapDisplay(lat, long ){

    mymap = L.map('map').setView([lat, long], 2);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGp0cnVld2F5IiwiYSI6ImNrODRvbHBqcTAxbXUzZnBleXR0cnQ0d2oifQ.PkWU4kpbQBnHCBkmTNHYtA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZGp0cnVld2F5IiwiYSI6ImNrODRvbHBqcTAxbXUzZnBleXR0cnQ0d2oifQ.PkWU4kpbQBnHCBkmTNHYtA'
    }).addTo(mymap);
    // add user on the map 
    addMarker(lat, long, 'je suis peterson');

    for (let index = 0; index < dataManager.data.length; index++) {
        let tmp = new Restaurant(dataManager.data[index]);
    }
    mymap.on('click', onMapClick);
   
}


/**
 * 
 * @param {latitude } lat 
 * @param {longitude} long 
 * @param {description } text 
 */
function addMarker (lat, long, text){
    var marker = L.marker([lat, long]).addTo(mymap).on('click', (e) =>{
        addGoogleStreetView(e.latlng.lat, e.latlng.long)
    });
    let msg = '<b>'+ text + '<b>'+'<br><br>'
    marker.bindPopup(msg);
}

/**
 * 
 * @param {latitude} lat 
 * @param {longitude} long 
 */
function addGoogleStreetView(lat, long){
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("modal-img"),
        {
          position: {
            lat: lat,
            lng: long
          },
          pov: {
            heading: 165,
            pitch: 0
          },
          zoom: 1
        }
      );

      $('#myModal').modal('show')

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

 async function addRestauFromGoogleMapApi(){
    if($('#search').val() === ''){
        $('#search').removeClass("form-control").addClass('form-control is-invalid')
        return;
    }else{
        $('#search').removeClass("form-control is-invalid").addClass('form-control is-valid')
    }
    let input =  $('#search').val()

    input = input.split(' ').join('+');
    console.log(input)

    let output = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${input}&key=AIzaSyB-dRps4HvUM88b3FJx_j4DoNKFsJNAcEc`
    console.log(output)

    await dataManager.importDataFromGoogle(output)

    console.log(dataManager.dataGoogle)

    for (let index = 0; index < dataManager.dataGoogle.length; index++) {
        const element = dataManager.dataGoogle[index];
        createRestau(element)
    }
    $('#search').val('')
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
