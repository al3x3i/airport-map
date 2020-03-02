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
    this.drawAirportPoint = this.drawAirportPoint.bind(this);
    this.callBackdrawAirportPoint = this.callBackdrawAirportPoint.bind(this);
  }

  callBackdrawAirportPoint(searchCityKey) {
    var lastSource = this.globalMap.getSource("airport-point");

    if (lastSource) {
      this.cleanMapPoints();
    }
    this.fetchAirportportData(searchCityKey);
  }

  drawAirportPoint(longitude, latitude) {
    this.globalMap
      .addSource("airport-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
              }
            }
          ]
        }
      })
      .addLayer({
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

  cleanMapPoints() {
    this.globalMap.removeLayer("airport-layer");
    this.globalMap.removeSource("airport-point");
  }

  fetchAirportportData(searchCityKey) {
    console.log("searchCityKey: " + searchCityKey);
    if (searchCityKey === "") {
      return;
    }

    axios
      .get(this.baseURL + "/search?q=" + searchCityKey)
      .then(response => {
        if (Object.keys(response.data).length !== 0) {
          var latitude = response.data.latitude;
          var longitude = response.data.longitude;
          this.drawAirportPoint(longitude, latitude);
          console.log("Request response: " + JSON.stringify(response.data));

          return;
        }
        console.log("Empty result");
      })
      .catch(error => {
        // alert(error);
        console.log(error);
        console.log(error.response.data);
        alert("Error, cannot get data!");
      });
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom
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
      console.log("TEST LOAD");
    });

    //TODO Better way to create Set map as Global
    this.globalMap = map;
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
        <SearchSerction callBackFunc={this.callBackdrawAirportPoint} />
      </div>
    );
  }
}

class SearchSerction extends React.Component {
  searchCallBack;
  constructor(props: Props) {
    super(props);
    this.searchCallBack = this.props.callBackFunc;
    this.findAirport = this.findAirport.bind(this);
  }

  findAirport(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.searchCallBack(e.target.value);
    }
  }

  // TODO input or better to make a form
  render() {
    return (
      <div className="search-section">
        <div>"Search Input"</div>
        <div>
          <input type="text" id="fname" onKeyDown={this.findAirport} />
        </div>
      </div>
    );
  }
}

export default App;
