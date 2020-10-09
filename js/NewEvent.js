window.onload = () => {

    const nametext = document.getElementById("name");
    nametext.onfocus = function (){
        nametext.value = "";
        nametext.style.color = "#000000"
    }

    nametext.onblur = function (){
        if(nametext.value.isEmpty())
        {
            nametext.style.color = "#a9a9a9"
            nametext.value = "Event name...";
        }
    }

    var lat = 0.0;
    var lon = 0.0;

    var mymap = L.map('mapid')

    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "" //ADD ACCESS TOKEN HERE
    }).addTo(mymap);

    mymap.locate()
    .on("locationfound", function(coords){
        lat = coords.latitude;
        lon = coords.longitude
        mymap.setView([lat, lon], 18)
    })
    .on("locationerror", function (error){
        lat = 40.856721;
        lon = 14.28451;
        mymap.setView([lat, lon], 18)
    });

}
