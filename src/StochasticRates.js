import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import RatesMap from "./RatesMap";
import PredictionMap from "./PredictionMap";

import return_rates from "./data/return_rates.json";
import rent_rates from "./data/rent_rates.json";

import mm1Queue from "./img/mm1_queue.png";

const tierMap = {
  1: "Quiet period: 7pm-6am",
  2: "Morning rush hours: 6am-9am",
  3: "Daytime: 9am-2pm",
  4: "Afternoon rush hours: 2pm-7pm",
  5: "Full day",
};

const tierLength = {
  1: 11,
  2: 3,
  3: 5,
  4: 5,
};

function StochasticRates() {
  const [tier, setTier] = useState(2);

  const rentTier =
    tier === 5
      ? rent_rates.map((r) =>
          [1, 2, 3, 4].reduce((sum, i) => sum + r[i] * tierLength[i], 0),
        )
      : rent_rates.map((r) => r[tier] * tierLength[tier] || 0);
  const returnTier =
    tier === 5
      ? return_rates.map((r) =>
          [1, 2, 3, 4].reduce((sum, i) => sum + r[i] * tierLength[i], 0),
        )
      : return_rates.map((r) => r[tier] * tierLength[tier] || 0);

  console.log(returnTier.reduce((a, b) => a + b, 0));
  console.log(rentTier.reduce((a, b) => a + b, 0));
  return (
    <>
      <h2>5. Stochastic rates</h2>
      <p>
        The bike sharing is in heart a stochastic process. In this section,
        I will model the rentals and returns as time-inhomogeneous Poisson process. This will allow me to predict
        the demand and supply of bikes for each station cluster. More importantly, look at the possible demands
        when station clusters are empty, therefore, suggests some rebalancing strategies.
      </p>
      <p>
        The rates of rentals and returns are assumed to be
        Poisson distributed. Each individual station cluster is modelled as a
        separate continuous-time infinite Markov chain, specifically map to a
        special case of <em>Birth and death process</em> of Queuing network{" "}
        <a href="https://en.wikipedia.org/wiki/M/M/1_queue">M/M/1</a>. [1]
      </p>

      <p>
        However, Rekola is a sort of dockerless bike-sharing system, there is no
        restriction on the number of bikes which can be parked at a station. Let{" "}
        <InlineMath>{`n`}</InlineMath> be number of bikes at a station, then the
        arrival / return of a bike happens with{" "}
        <InlineMath>{`\\lambda`}</InlineMath> rate and departure / rent with{" "}
        <InlineMath>{`\\mu`}</InlineMath> rate. [2]
      </p>
      <BlockMath>{`q(n, n + 1) = \\lambda, n \\ge 0`}</BlockMath>
      <BlockMath>{`q(n, n-1) = \\mu, n \\ge 1`}</BlockMath>
      <div className="center">
        <img src={mm1Queue} alt="M/M/1 queue." />
        <div style={{ textAlign: "justify" }}>
          <span className="image-desc">
            M/M/1 queue with arrival rate <InlineMath>{`\\lambda`}</InlineMath>{" "}
            and departure rate <InlineMath>{`\\mu`}</InlineMath>. Source of the
            image{" "}
            <a href="https://en.wikipedia.org/wiki/M/M/1_queue">Wikipedia</a>.
          </span>
        </div>
      </div>

      <p>
        From <Link to={"/"}>previous section</Link> is clear that
        number of rides is highly seasonal, it varies throughout the day and
        workdays differs from weekends / public holidays. In order to avoid
        those effects, I look at rides which happened between April to September
        and focus only on workdays. To capture which stations are more popular
        during different times of the day, I divide the day into 4{" "}
        <em>tiers</em>
        &nbsp;(<InlineMath>{`\\tau=\\{T_1, T_2, T_3, T_4\\}`}</InlineMath>) as
        follows:
      </p>
      <ul>
        <li>
          <strong>Quiet period</strong> <InlineMath>{`T_1`}</InlineMath>:
          7pm-6am
        </li>
        <li>
          <strong>Morning rush hours</strong> <InlineMath>{`T_2`}</InlineMath>:
          6am-9am
        </li>
        <li>
          <strong>Daytime</strong> <InlineMath>{`T_3`}</InlineMath>: 9am-2pm
        </li>
        <li>
          <strong>Afternoon rush hours</strong> <InlineMath>{`T_4`}</InlineMath>
          : 2pm-7pm
        </li>
      </ul>

      <p>
        To get more comprehensive view of the bike flow, I clustered the
        stations into 104 clusters &nbsp;
        <InlineMath>{`\\xi = 1,...,104`}</InlineMath>, based on the{" "}
        <Link to={"/rekola-clusters"}>K-mean</Link> clustering. Let's &nbsp;
        <InlineMath>{`\\lambda_{\\xi}(\\tau)`}</InlineMath> be the rate of
        rentals at station cluster <InlineMath>{`\\xi`}</InlineMath> during time
        tier <InlineMath>{`\\tau`}</InlineMath>, and{" "}
        <InlineMath>{`\\mu_{\\xi}(\\tau)`}</InlineMath> be the rate of returns
        at station cluster &nbsp;<InlineMath>{`\\xi`}</InlineMath> during time
        tier <InlineMath>{`\\tau`}</InlineMath>. Then the{" "}
        <em>transition rate matrix</em>{" "}
        <InlineMath>{`Q_{\\xi}(\\tau)`}</InlineMath> for cluster{" "}
        <InlineMath>{`\\xi`}</InlineMath> at <InlineMath>{`\\tau`}</InlineMath>{" "}
        is defined as:
      </p>

      <div style={{ width: "1000px", marginLeft: "-150px", textAlign: "center" }}>
        <BlockMath>{`Q_{\\xi}(\\tau) =
              \\begin{pmatrix}
              -\\lambda_{\\xi}(\\tau) & \\lambda_{\\xi}(\\tau) &  & & \\\\
              \\mu_{\\xi}(\\tau) & -(\\mu_{\\xi}(\\tau) +\\lambda_{\\xi}(\\tau)) & \\lambda_{\\xi}(\\tau) &  &\\\\
                & \\mu_{\\xi}(\\tau) & -(\\mu_{\\xi}(\\tau) +\\lambda_{\\xi}(\\tau)) & \\lambda_{\\xi}(\\tau) & \\\\
               & & & & \\ddots
              \\end{pmatrix}`}</BlockMath>
      </div>
      <h3>5.1. Calculating rates</h3>
      <p>
        The rates of rentals and returns are estimated from the data. However
        the Rekola system is not limited by number of available slots at the
        stations, we aren't limited on returns. While if there is no available
        bike at a station cluster, it doesn't make sense to infer rent rates on
        snapshots of empty stations.
      </p>
      <p>
        Let <InlineMath>{`A_{\\xi}(\\tau)`}</InlineMath> be the set of
        observations of returns at station cluster &nbsp;
        <InlineMath>{`\\xi`}</InlineMath> during time tier{" "}
        <InlineMath>{`\\tau`}</InlineMath>
      </p>
      <BlockMath>
        {`\\lambda_{\\xi}(\\tau) = \\frac{1}{|\\tau|}\\sum_{d \\in A_{\\xi}(\\tau)} \\#\\ arrivals\\ during \\ \\tau`}
      </BlockMath>
      <p>
        For bike <em>departures</em> it is more complicated as we want to
        account only for snapshots when there is at least one bike at given
        station cluster, therefore, let <InlineMath>{`D_{\\xi}(\\tau)`}</InlineMath> be
        the set of observations of rentals at station cluster
      </p>
      <BlockMath>
        {`\\mu_{\\xi}(\\tau) = \\frac{\\sum_{d \\in D_{\\xi}(\\tau)} \\#\\ departures\\ during \\ \\tau}
                {\\sum_{d \\in D_{\\xi}(\\tau)} \\#\\ 'valid'\\ snapshots\\ during\\ \\tau}`}
      </BlockMath>
      <p>
        However, the time triers are not equally length, therefore, they are
        calculated as number of arrivals / departures per hour. To get a number
        of returns / rentals per time tier, we multiply the rates by the length
        of the time tier.
      </p>
      <p>
        The probability of <em>k</em> arrivals / departures during time tier{" "}
        <InlineMath>{`\\tau`}</InlineMath> is
      </p>

      <BlockMath>{`p^{return}_\\xi(k, \\tau)=\\frac{(\\lambda_{\\xi}(\\tau)\\cdot|\\tau|)^k}{k!}e^{-\\lambda_{\\xi}(\\tau)\\cdot|\\tau|}`}</BlockMath>

      <p>
        To validate and compare the Poisson distribution, I will use the{" "}
        <em>empirical distribution</em> of rentals and returns. Both of them are
        plotted below. The issue is how to calibrate rent rates, as we will
        observe no or very few rentals at empty stations. Gast et. al. [2] come
        up with two alternatives: first just ignore days when there is a no bike
        at a station cluster, second calculate relative occurrence of empty
        stations and multiply the rates by this factor (e.g. if a cluster is
        empty 1/3 of the time, if it were never empty the number of rents would
        be 3/2 higher). I end up using the second approach.
      </p>

      <div  style={{ width: "1000px", marginLeft: "-150px", textAlign: "center" }}>
        <RatesMap />
      </div>

      <div style={{ textAlign: "justify" }}>
        <span className="image-desc">
          You can choose between 4 different tiers of the day, 104 clusters of
          stations by clicking on the circles on the map. To see the
          distributions, you can choose between density and cumulative
          distribution function. The empirical distribution is based on the
          data, while the Poisson distribution is based on the estimated rates.
        </span>
      </div>

      <h3>5.2. Predicting demand and supply</h3>
      <p>
        Knowing the rates we can predict expected (average) number of rentals
        and returns for each station cluster. On the map below, you can see the
        expected number of rentals and returns for each station cluster.
        However, the rates are estimated from April to September which has an
        average 675 rides per day.
      </p>

      <div style={{ width: "1000px", marginLeft: "-150px", textAlign: "center" }}>
        <ul className={"inline"}>
          {[1, 2, 3, 4, 5].map((t) => (
            <>
              <li>
                <input
                  type={"radio"}
                  value={"tier"}
                  id={`radio-${t}-rates`}
                  checked={tier === t}
                  onChange={() => setTier(t)}
                />
                <label htmlFor={`radio-${t}-rates`}>{tierMap[t]}</label>
              </li>
            </>
          ))}
        </ul>
        <PredictionMap rents={rentTier} returns={returnTier} />
        <div style={{ textAlign: "justify" }}>
          <span className="image-desc">
            You can choose between 4 different tiers of the day, 104 clusters of
            stations by clicking on the circles on the map.
          </span>
        </div>
      </div>

      <h3>5.3. Supply and demand discrepancy</h3>
      <p>
        One of the most important goal of this model is to calculate the demand for each station cluster, given
        the fact that sometimes the cluster might be empty. This creates a discrepancy between supply and demand for
        each of the station clusters, where supply is not restricted i.e. you can return bike to any station cluster, but
        you can't rent a bike from an empty station cluster.
      </p>
      <p>
        This discrepancy hints how many possible rides would happened if there was always a bike available to rent at
        all stations / clusters. In the monitored period (April to September), with the average of 675 rides per day,
        the <em>hypothetical</em> induced demand would account up to 20% increase in the number of rides. Which is a
        astonishing number, as it would mean that the demand for bike-sharing is much higher than the
        supply <sup><a href="#induced-demand">1</a></sup>.
      </p>

      <h3 className="reference">References:</h3>
      <ol className="reference">
        <li>
          Nicolas Gast, Guillaume Massonnet, Daniël Reijsbergen, Mirco
          Tribastone. (2015) &nbsp;
          <em>
            Probabilistic Forecasts of Bike-Sharing Systems for Journey
            Planning.
          </em>
          &nbsp;The 24th ACM International Conference on Information and
          Knowledge Management Oct 2015, Melbourne, Australia.
          ff10.1145/2806416.2806569ff. ffhal-01185840f
        </li>
        <li>
          Richard Durrett. (2016) <em>Essentials of Stochastic Processes</em>.
          3rd edition 2016. Cham: Springer International Publishing.
        </li>
      </ol>

      <ol className="foot-notes">
        <li id="induced-demand">About 2/3  of those extra rides could happen with the same amount of bikes if they are
          rebalanced between the stations. So, obviously Rekola could balance bikes
        in every <em>moment</em> so that there will always at least one bike at each station cluster, which is nearly impossible.
        Therefore, a more realistic guess would be to look at the tiers independently. If bikes would always be
        available, then expected number of rents (rides) would be <InlineMath>{`\\sum_{\\xi}\\sum_{\\tau}|\\tau|\\mu_{\\xi} \\approx 855`}</InlineMath>,
        which 180 more than the actual rides in the accounted period. If we move bikes from places where more bikes are returned then rented,
        it would account for <InlineMath>{`\\sum_{\\xi}\\sum_{\\tau}|\\tau|(\\lambda_{\\xi} - \\mu_{\\xi})^+ \\approx 120`}</InlineMath>,
        which is 2/3 of the extra rides. Obviously all of those calculation have to be taken with a large grain of salt,
        bikes cannot be splitted into smaller pieces (that's what I am implicitly doing here, collecting fractions of unused
        bikes and rebalancing them across the city).</li>
      </ol>
    </>
  );
}

export default StochasticRates;
