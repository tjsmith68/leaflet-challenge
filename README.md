# leaflet-challenge

This Repository Contains My Leaflet Challenge Homework
It pulls all earthquake data from the USGS website for the past week

Files in this Repository:

    readme.md               This file

    index.html              Base html code with container for leaflet map

    static/css/style.css    Simple style sheet for this site

    static/js/logic.js      Java Script for reading in earthquake data and displaying 
                            it on the map

    static/data/PlateInterface.kml  

                            This file is subset of plate-boundaries.kmz file available
                            from USGS. The java script logic makes use of the omnivore
                            leaflet plugin in order to easily display this data.


--- Note ---  The index.html should be accessed by running a python http server so that
                the local files may be read (PlateInterface.kml)

                