// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize all the LayerGroups that we'll use.
var layers = {
  EarthQuakes: new L.LayerGroup(),
  TectonicPlates: new L.LayerGroup()
};

// Create the map with our layers.
var map = L.map("map", {
  center: [0, -85.000],
  zoom: 3,
  layers: [
    layers.EarthQuakes,
    layers.TectonicPlates
  ]
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Create an overlays object to add to the layer control.
var overlays = {
  "Earthquakes": layers.EarthQuakes,
  "Tectonic Plates": layers.TectonicPlates
};

// Create a control for our layers, and add our overlays to it.
L.control.layers(null, overlays).addTo(map);


// Get earthquake data from USGS site.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(quakeData) {

    let quakeList = quakeData.features;

    var colors = [ "#ffffb2",
                  "#f6e2a2",
                  "#edc692",
                  "#e5aa83",
                  "#dc8d73",
                  "#d37164",
                  "#cb5554",
                  "#c23845",
                  "#b91c35",
                  "#b10026"];

    var limits = [ "<20",
                  "20-40",
                  "40-60",
                  "60-80",
                  "80-100",
                  "100-200",
                  "200-300",
                  "300-400",
                  "400-500",
                  ">500"];

    var fillColor;


    for (var i = 0; i < quakeList.length; i++) {

        var quake = quakeList[i];

        var depth = quake.geometry.coordinates[2];

        //Pick circle fill color from colors based on depth

        if (depth > 500) {
          fillColor = colors[9];
        }
        else if (depth > 400) {
          fillColor = colors[8];
        }
        else if (depth > 300) {
          fillColor = colors[7];
        }
        else if (depth > 200) {
          fillColor = colors[6];
        }
        else if (depth > 100) {
          fillColor = colors[5];
        }
        else if (depth > 80) {
          fillColor = colors[4];
        }
        else if (depth > 60) {
          fillColor = colors[3];
        }
        else if (depth > 40) {
          fillColor = colors[2];
        }
        else if (depth > 20) {
          fillColor = colors[1];
        }
        else {
          fillColor = colors[0];
        }

// Use magnitude as an exponent since scale is log, then multiple by cosine of latitude to correct
// for map projection circle scaling.
        var quakeSize = (Math.pow(2, quake.properties.mag)) * 20000*Math.cos((quake.geometry.coordinates[1]/180)*Math.PI)

        var newQuake = L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
            color: 'black',
            weight: 1,
            fillColor: fillColor,
            fillOpacity: .75,
            radius: quakeSize
        });

        newQuake.addTo(layers.EarthQuakes);

        newQuake.bindPopup(" Magnitude: " + quake.properties.mag + "<br> Place: " + quake.properties.place + 
                            "<br> Depth: " + depth +
                            "<br> Coordinates: " + quake.geometry.coordinates[1] + ", " + quake.geometry.coordinates[0]);
                            // "<br>" + quake.properties.url);
    };

    // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var labels = [];
    
    // Add the minimum and maximum.
      var legendInfo = "<h1>Earthquake Depth</h1>" +
        "<div class=\"labels\">" +
        "</div>";

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">" + limits[index] + "</li>");
      });

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };

    // Adding the legend to the map
    legend.addTo(map);


    var kmlData = omnivore.kml('static/data/PlateInterface.kml');
    kmlData.addTo(layers.TectonicPlates);    

});
