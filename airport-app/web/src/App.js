// import "./App.css";

import React from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWwzeDNpIiwiYSI6ImNrNno3dXk2dTBtZGIzZnBpdzZjdmxjeDIifQ.Hjf7L60Y3Rk45MFdXCzn9Q";

class App extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
      zoom: 1.5
    };
    this.baseURL = "http://localhost:5000";
    this.globalMap = null;
    this.drawAirportPoint = this.drawAirportPoints.bind(this);
    this.callbackSearchAirportCity = this.callbackSearchAirportCity.bind(this); // How to bind, shorter code
    this.callbackSearchAirportName = this.callbackSearchAirportName.bind(this);
  }

  drawAirportPoints(values) {
    var featuresData = values.map(function(value) {
      var formattedPoint = {
        type: "Feature",
        properties: {
          airportData: value.airportDetails
        },
        geometry: {
          type: "Point",
          coordinates: [value.cooridantes[0], value.cooridantes[1]]
        }
      };
      return formattedPoint;
    });

    var formattedPointsData = {
      type: "FeatureCollection",
      features: featuresData
    };

    this.globalMap.addSource("airport-point", {
      type: "geojson",
      data: formattedPointsData
    });

    this.globalMap.addLayer({
      id: "airport-layer",
      type: "circle",
      source: "airport-point",
      paint: {
        "circle-radius": 6,
        "circle-color": "#B42222"
      },
      filter: ["==", "$type", "Point"]
    });
  }

  flyToMapPosition(longitude, latitude) {
    this.globalMap.flyTo({
      center: [longitude, latitude],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      speed: 0.7,
      zoom: 7
    });
  }

  cleanMapPoints() {
    this.globalMap.removeLayer("airport-layer");
    this.globalMap.removeSource("airport-point");
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom,
      attributionControl: false //Hint: Remove MapBox logo
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on("load", function() {
      console.log("Call on load function");
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on("mouseenter", "airport-layer", function(e) {
      map.getCanvas().style.cursor = "pointer";

      var coordinates = e.features[0].geometry.coordinates.slice();
      var airportDetails = e.features[0].properties.airportData;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(airportDetails)
        .addTo(map);
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "airport-layer", function() {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    //TODO another way to set map as global variable
    this.globalMap = map;
  }

  clearMapDraw() {
    var lastSource = this.globalMap.getSource("airport-point");

    if (lastSource) {
      this.cleanMapPoints();
    }
  }

  callbackSearchAirportName(airportName) {
    this.clearMapDraw();
    this.fetchAirportportData("", airportName);
  }

  callbackSearchAirportCity(searchCityKey) {
    this.clearMapDraw();
    this.fetchAirportportData(searchCityKey, "");
  }

  fetchAirportportData(searchCityKey, searchNameKey) {
    var searchURL = this.baseURL + "/search";

    if (searchCityKey !== "") {
      searchURL += "?c=" + searchCityKey;
    } else if (searchNameKey !== "") {
      searchURL += "?n=" + searchNameKey;
    } else {
      console.log("Missing search key");
      return;
    }

    axios
      .get(searchURL)
      .then(response => {
        if (Object.keys(response.data).length !== 0) {
          // var cooridantes = response.data.map(function(p) {
          //   return [p.longitude, p.latitude];
          // });

          // Searching by by city 'New' might return many aiports, like: New Bern, New Orleans, New York ..
          var values = response.data.map(function(p) {
            var coordinateDetails = [p.longitude, p.latitude];
            var details = p;
            return { cooridantes: coordinateDetails, airportDetails: details };
          });

          this.drawAirportPoints(values);

          // Fly to first position
          this.flyToMapPosition(
            response.data[0].longitude,
            response.data[0].latitude
          );
          console.log("Request response: " + JSON.stringify(response.data));
        } else {
          console.log("Empty result");
        }
      })
      .catch(error => {
        console.log(error);
        alert("Error, cannot get data!");
      });
  }

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
            {this.state.zoom}
          </div>
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
        <SearchSerction
          callBackFuncCity={this.callbackSearchAirportCity}
          callBackFuncName={this.callbackSearchAirportName}
        />
      </div>
    );
  }
}

class SearchSerction extends React.Component {
  searchCityCallBack;
  searchNameCallBack;
  constructor(props: Props) {
    super(props);
    this.searchCityCallBack = this.props.callBackFuncCity;
    this.searchNameCallBack = this.props.callBackFuncName;
    this.findAirportCity = this.findAirportCity.bind(this);
    this.findAirportName = this.findAirportName.bind(this);
  }

  findAirportCity(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.searchCityCallBack(e.target.value);
    }
  }

  findAirportName(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.searchNameCallBack(e.target.value);
    }
  }

  // TODO input or better to make a form
  render() {
    return (
      <div className="search-section">
        <div className="search-title">Quick Search</div>
        <div class="md-form active-pink active-pink-2 mb-3 mt-0">
          <div className="search-goup airport-city">
            <label className="mdb-main-label">Search by airport city:</label>{" "}
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onKeyDown={this.findAirportCity}
            />
          </div>
          <div className="search-goup airport-name">
            <label className="mdb-main-label">Search by airport name:</label>{" "}
            <input
              className="form-control"
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onKeyDown={this.findAirportName}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
