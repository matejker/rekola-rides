import React, { useState } from "react";
import { Map, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { LineChart, Line, Legend, XAxis, YAxis } from "recharts";

import empiric_cdfs from "./data/empiric_cdfs.json";
import empiric_fs from "./data/empiric_fs.json";
import poisson_cdfs from "./data/poisson_cdfs.json";
import poisson_fs from "./data/poisson_fs.json";
import stations from "./data/clustered_stations.json";
import k_s from "./data/k_s.json";

const tiers = {
  1: "Quiet period: 7pm-6am",
  2: "Morning rush hours: 6am-9am",
  3: "Daytime: 9am-2pm",
  4: "Afternoon rush hours: 2pm-7pm",
};

const RatesMap = () => {
  const [cluster, setCluster] = useState(43);
  const [tier, setTier] = useState(2);
  const [functionType, setFunctionType] = useState("density");

  const rentDensity = poisson_cdfs.rents[cluster][tier].map((p, i) => ({
    rents: i,
    Poisson: Math.round(poisson_fs.rents[cluster][tier][i] * 10000) / 10000,
    Empirical: Math.round(empiric_fs.rents[cluster][tier][i] * 10000) / 10000,
  }));

  const rentCDF = poisson_cdfs.rents[cluster][tier].map((p, i) => ({
    rents: i,
    Poisson: Math.round(p * 10000) / 10000,
    Empirical: Math.round(empiric_cdfs.rents[cluster][tier][i] * 10000) / 10000,
  }));

  const returnDensity = poisson_cdfs.returns[cluster][tier].map((p, i) => ({
    returns: i,
    Poisson: Math.round(poisson_fs.returns[cluster][tier][i] * 10000) / 10000,
    Empirical: Math.round(empiric_fs.returns[cluster][tier][i] * 10000) / 10000,
  }));

  const returnCDF = poisson_cdfs.returns[cluster][tier].map((p, i) => ({
    returns: i,
    Poisson: Math.round(p * 10000) / 10000,
    Empirical:
      Math.round(empiric_cdfs.returns[cluster][tier][i] * 10000) / 10000,
  }));

  const maxDiffReturn =
    Math.round(k_s.returns[cluster][tier][0] * 10000) / 10000;
  const cStatsReturn =
    Math.round(k_s.returns[cluster][tier][1] * 10000) / 10000;

  const maxDiffRent = Math.round(k_s.rents[cluster][tier][0] * 10000) / 10000;
  const cStatsRent = Math.round(k_s.rents[cluster][tier][1] * 10000) / 10000;

  console.log(
    `Kolmogorov–Smirnov test for ${cluster} cluster, ${tier} tier and return: ${maxDiffReturn}, ${cStatsReturn}, Accepting hypothesis? ${maxDiffReturn < cStatsReturn}`,
  );
  console.log(
    `Kolmogorov–Smirnov test for ${cluster} cluster, ${tier} tier and return: ${maxDiffRent}, ${cStatsRent}, Accepting hypothesis? ${maxDiffRent < cStatsRent}`,
  );

  return (
    <>
      <div style={{ width: "100%", height: "500px", textAlign: "center" }}>
        <ul className={"inline"}>
          {[1, 2, 3, 4].map((t) => (
            <>
              <li>
                <input
                  type={"radio"}
                  value={"tier"}
                  id={`radio-${t}`}
                  checked={tier === t}
                  onChange={() => setTier(t)}
                />
                <label htmlFor={`radio-${t}`}>{tiers[t]}</label>
              </li>
            </>
          ))}
        </ul>
        <div
          className="left" style={{ width: "500px", height: "350px", textAlign: "center" }}
        >
          <h3>Rents</h3>
          <LineChart
            width={450}
            height={250}
            data={functionType === "density" ? rentDensity : rentCDF}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type={functionType === "cdf" ? "stepAfter" : "monotone"}
              dataKey="Poisson"
              dot={functionType === "cdf"}
              stroke="#007185"
            />
            <Line
              type={functionType === "cdf" ? "stepAfter" : "monotone"}
              dataKey="Empirical"
              dot={functionType === "cdf"}
              stroke="#C7511F"
            />
            <XAxis dataKey="rents" />
            <YAxis domain={[0, 1]} />
            <Legend
              layout={"horizontal"}
              verticalAlign={"top"}
              align={"right"}
              height={25}
            />
            {/*<Tooltip />*/}
          </LineChart>
        </div>

        <div
          className="right"
          style={{ width: "500px", height: "350px", textAlign: "center" }}
        >
          <h3>Returns</h3>
          <LineChart
            width={450}
            height={250}
            data={functionType === "density" ? returnDensity : returnCDF}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type={functionType === "cdf" ? "stepAfter" : "monotone"}
              dataKey="Poisson"
              dot={functionType === "cdf"}
              stroke="#007185"
            />
            <Line
              type={functionType === "cdf" ? "stepAfter" : "monotone"}
              dataKey="Empirical"
              dot={functionType === "cdf"}
              stroke="#C7511F"
            />
            <XAxis dataKey="returns" />
            <YAxis domain={[0, 1]} />
            <Legend
              layout={"horizontal"}
              verticalAlign={"top"}
              align={"right"}
              height={25}
            />
            {/*<Tooltip />*/}
          </LineChart>
        </div>
        <ul className={"inline"}>
          <li>
            <input
              type={"radio"}
              value={"density"}
              id={"radio-density"}
              checked={functionType === "density"}
              onChange={() => setFunctionType("density")}
            />
            <label htmlFor={"radio-density"}>Density function</label>
          </li>
          <li>
            <input
              type={"radio"}
              value={"cdf"}
              id={"radio-cdf"}
              checked={functionType === "cdf"}
              onChange={() => setFunctionType("cdf")}
            />
            <label htmlFor={"radio-cdf"}>
              Cumulative distribution function
            </label>
          </li>
        </ul>
      </div>
      <></>
      <Map
        style={{ height: "50vh" }}
        zoom={15}
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
              fillOpacity={0.95}
              color={cluster === i ? "#C7511F" : "#007185"}
              key={i}
              onClick={() => setCluster(i)}
            />
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

export default RatesMap;
