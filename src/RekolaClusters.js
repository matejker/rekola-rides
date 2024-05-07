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
      <h2>3. Rekola station clusters</h2>

      <p>
        Rekola in Bratislava is operating as a dockless bikesharing service [1], which means that bike can be left at stations
        regardless of the station's capacity. This is sort of hybrid between docked and dockless service. Often, dockerless
        services allows you to park the bike anywhere, but Rekola has about 300 stations where you can park the bike. If
        you park the bike outside the station, you will be charged a fee [2].
      </p>
      <p>
        Rekola bikes seems to have a high precision tracking and for every aviailable bike, they record the location. This
        location is often around the official stations, but there are some outliers. To see where the available bikes were
        localed, following heatmap shows all the positions.
      </p>

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
            latitude and longitude <sup><a href="#xkcd">1</a></sup>. This can create a certain noise around stations.
            There is a certain form on signal jamming around the Danube river, there is bunch of ride endpoints in
            he river <sup><a href="#salzburg">2</a></sup>.
          </span>
        </div>
      </div>

      <p>
        Couple of observations can be made from the heatmap. First, even if Rekola punishes you for parking the bike outside
        the station, there are still many bikes parked outside the station. Second, there are some stations that are
        with a significant noise around them - bikes were parked in close proximity to the station. Lastly, this map
        shows a sort of heatmap of station usage, the more frequently used are darker and have blurred surroundings,
        while some stations are very light, meaning they are not used often.
      </p>

      <h3>3.1. Grouping stations into clusters</h3>

      <p>
        However, the total number of stations and bikes is roughly equal to 300 and some stations being very close to each
        (e.g. in some cases there are 3 stations on the same square), it almost seems like a dockerless service. In order
        to do some prediction analysis and investigate some patterns, it seems reasonable to reduce the number of stations.
        I used two methods to cluster the stations, K-means clustering and regular grid of size roughly 500m x 500m - which
        sounds like a reasonable distance to walk to get an available bike. Both clustering methods generated 104 "station"
        (first I plot the grid and got 104 blocks, then I adjusted the k-means to get 104 clusters).
        Similar method of clustering for dockerless services was used in paper by Hua et. al. [3]. The resulting cluster
        centers are very similarly located and can be seen on the map below.
      </p>

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
          src={clustering === "kmeans" ? clustered_stations : geo_clustered_stations}
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

      <h3>3.2. Conclusion</h3>
      <p>
        This clustering will be essential stepping stone for further analysis. The clustering will allow us to reduce the
        number of stations and thus reduce the number of parameters in the model. I assume that user incentive to use
        bike wouldn't change rapidly if the station is moved up to 250m.
      </p>

      <h3 className="reference">References:</h3>
      <ol className="reference">
        <li>
          Wikipedia (2023), <em>Rekola</em> Wikimedia Foundation, &nbsp;
          <a href={"https://en.wikipedia.org/wiki/Rekola#Outside_of_the_Czech_Republic"}>Wikipedia: Rekola#Outside_of_the_Czech_Republic</a>
        </li>
        <li>
          Rekola Bikesharing SK s.r.o.,{" "}
          <em>"Rekola - Discover city with Rekola Bikesharing</em>, &nbsp;
          <a href="https://www.rekola.sk/">link</a>
        </li>
        <li>
          Mingzhuang Hua, Jingxu Chen, Xuewu Chen, Zuoxian Gan, Pengfei Wang, De Zhao (2020).
          <em>Forecasting usage and bike distribution of dockless bike-sharing using journey data</em>.
          IET Intelligent Transport Systems. 14. 10.1049/iet-its.2020.0305.
        </li>
      </ol>

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
