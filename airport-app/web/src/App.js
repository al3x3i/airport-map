// import "./App.css";

import React from "react";
// import axios from "axios";
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
    this.globalMap = null;
    this.drawAirportPoint = this.drawAirportPoint.bind(this);
    this.callBackdrawAirportPoint = this.callBackdrawAirportPoint.bind(this);
  }

  callBackdrawAirportPoint(cityName) {
    var lastSource = this.globalMap.getSource("airport-point");

    if (lastSource) {
      this.cleanMapPoints();
    }
    this.drawAirportPoint();
    console.log(cityName);
  }

  drawAirportPoint() {
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
                coordinates: [26.6, 58.3]
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
    this.fetchAirportportData();
  }

  cleanMapPoints() {
    this.globalMap.removeLayer("airport-layer");
    this.globalMap.removeSource("airport-point");
  }

  fetchAirportportData() {
    // axios
    //   .get("https://api.github.com/users/maecapozzi")
    //   .then(response => console.log(response));
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
  drawAirport;
  constructor(props: Props) {
    super(props);
    this.drawAirport = this.props.callBackFunc;
    this.findAirport = this.findAirport.bind(this);
  }

  findAirport(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.drawAirport(e.target.value);
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
