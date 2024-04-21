import React, { useState } from "react";

import geo_clustered_stations from "./img/104_geo_clustered_stations.png";
import clustered_stations from "./img/104_clustered_stations.png";
import endpoint_heatmap from "./img/endpoint_heatmap2.png";
import all_stations from "./img/all_stations.png";

function RekolaClusters() {
  const [clustering, setClustering] = useState("kmeans");
  const [stations, setStations] = useState("rides");

  return (
    <>
      <h2>Rekola station clusters</h2>

      <div className="center">
        <ul className={"inline"}>
          <li>
            <input
              type={"radio"}
              value={"rides"}
              id={"radio-rides"}
              checked={stations === "rides"}
              onChange={() => setStations("rides")}
            />
            <label htmlFor={"radio-rides"}>Rides</label>
          </li>
          <li>
            <input
              type={"radio"}
              value={"stations"}
              id={"radio-stations"}
              checked={stations === "stations"}
              onChange={() => setStations("stations")}
            />
            <label htmlFor={"radio-stations"}>Stations</label>
          </li>
        </ul>
        <img
          src={stations === "rides" ? endpoint_heatmap : all_stations}
          style={{ width: "1000px", marginLeft: "-150px" }}
        />
        <div style={{ textAlign: "justify" }}>
          <span className="image-desc">
            However, Rekola is a sort of mix of docker and dockerless service
            and they record fairly precise bike location up to 5 digits of
            latitude and longitude{" "}
            <sup>
              <a href="#xkcd">1</a>
            </sup>
            . This can create a certain noise around stations. There is a
            certain form on signal jamming around the Danube river, there is
            bunch of ride endpoints in the river{" "}
            <sup>
              <a href="#salzburg">2</a>
            </sup>
            .
          </span>
        </div>
      </div>

      <div className="center">
        <ul className={"inline"}>
          <li>
            <input
              type={"radio"}
              value={"kmeans"}
              id={"radio-kmeans"}
              checked={clustering === "kmeans"}
              onChange={() => setClustering("kmeans")}
            />
            <label htmlFor={"radio-kmeans"}>K-means</label>
          </li>
          <li>
            <input
              type={"radio"}
              value={"geo"}
              id={"radio-geo"}
              checked={clustering === "geo"}
              onChange={() => setClustering("geo")}
            />
            <label htmlFor={"radio-geo"}>Grid</label>
          </li>
        </ul>
        <img
          src={
            clustering === "kmeans"
              ? clustered_stations
              : geo_clustered_stations
          }
          style={{ width: "1000px", marginLeft: "-150px" }}
        />
        <div style={{ textAlign: "justify" }}>
          <span className="image-desc">
            In order to reduce total number of stations, we can cluster them. I
            used two methods, K-means clustering and regular grid of size
            roughly 500m x 500m (first, I plot grid, then if a station was in
            the grid cell, I put a cluster center there). Both clustering
            methods generated 104 "station".
          </span>
        </div>
      </div>

      <ol className="foot-notes">
        <li id="xkcd">
          5 decimal digits in longitude / latitude according to{" "}
          <a href={"https://xkcd.com/2170/"}>xkcd</a>
          &nbsp;means "
          <em>
            you are pointing to a specific person in a room, but since you
            didn't include datum information we can't tell who
          </em>
          ". In other words, it is very precise.
        </li>
        <li id="salzburg">
          Fun fact: One of the ride endpoint is recorded in Salzburg, which is
          300 km away from Bratislava.
        </li>
      </ol>
    </>
  );
}

export default RekolaClusters;
