import React from "react";
import { Map, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { ColorHeatmap } from "./colorHeatmap";

import stations from "./data/clustered_stations.json";

const PredictionMap = (props) => {
  return (
    <>
      <Map
        style={{ height: "80vh" }}
        zoom={16}
        bounds={[
          [48.16, 17.21],
          [48.12, 17.0],
        ]}
      >
        {stations.map((s, i) => {
          return (
            <CircleMarker
              center={s}
              radius={4}
              key={i}
              fillOpacity={0.95}
              color={ColorHeatmap(props.rents)[i]}
            >
              <Popup>
                Expected rents: {Math.round(props.rents[i])}
                <br />
                Expected returns: {Math.round(props.returns[i])}
              </Popup>
            </CircleMarker>
          );
        })}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
      </Map>
    </>
  );
};

export default PredictionMap;
