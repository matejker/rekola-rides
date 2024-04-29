import React, { useState } from "react";
import { Link } from "react-router-dom";
import { InlineMath, BlockMath } from "react-katex";
import PredictionMap from "./PredictionMap";

import production from "./data/production.json";
import attractions from "./data/attractions.json";
import production_summer from "./data/production_summer.json";
import attractions_summer from "./data/attractions_summer.json";

import rides_prediction from "./img/rides_prediction.png";

function MarkovChain() {
  const [totalRides, setTotalRides] = useState(675);
  const [season, setSeason] = useState("summer");

  const productionRates = season === "summer" ? production_summer : production;
  const attractionsRates = season === "summer" ? attractions_summer : attractions;

  return (
    <>
      <h2>Markov Chains</h2>
      <p>
        Fundamentally bikesharing is about the flow of bikes between stations.
        The flow can be modelled as a{" "}
        <a href={"https://en.wikipedia.org/wiki/Markov_chain"}>Markov chain</a>{" "}
        [1], where the probability of a bike moving from one station to another
        depends only on the current station. The transition matrix is calculated
        based on historical rides.
      </p>
      <p>
        Formally defined, a Markov chain is a stochastic process with the memoryless property (also called Markov property).
        The probability of the next state depends only on the current state and not on the sequence of events that preceded it.
        (i.e. probability of user riding a bike from station A to station B depends only on the current station A
        regardless where the bike was stationed before arriving to station A).
      </p>
      <p>
        Let <InlineMath>{`X_n`}</InlineMath> be a state (position of the bike) at time step n, then the Markov property
        can be written as:
      </p>

      <BlockMath>{`P(X_{n+1}=j | X_{n}=i,X_{n-1}=i_{n-1}, \\dots, X_{0}=i_0)=`}</BlockMath>
      <BlockMath>{`P(X_{n+1}=j|X_{n}=i) = p_{ij}`}</BlockMath>

      <p>
        <InlineMath>{`p_{ij}`}</InlineMath> is then call a transition probability from state i to state j
        (probability of a bike going from station i to station j). All transition probabilities are stored in a matrix
        called a transition matrix <InlineMath>{`P`}</InlineMath>.
      </p>
      <BlockMath>{`P =
              \\begin{pmatrix}
              p_{11} & p_{12} & \\cdots & p_{1n} \\\\
              p_{21} & p_{22} & \\cdots & p_{2n} \\\\
              \\vdots & \\vdots & \\ddots & \\vdots \\\\
              p_{n1} & p_{n2} & \\cdots & p_{nn}
              \\end{pmatrix}`}</BlockMath>

      <h3>Determining transition matrix based on historical rides</h3>
      <p>
        First, to reduce the number of stations, I used previously described &nbsp;<Link to={"/rekola-clusters"}>K-mean</Link> clustering,
        and compound all the stations into <InlineMath>{`n=104`}</InlineMath> clusters.
      </p>
      <p>
        Secondly, to predict number of rents and returns from a given custer, I need to build production and attraction
        matrices. Let <InlineMath>{`A = a_\{ij\}`}</InlineMath> be the attraction matrix where an entry <InlineMath>{`a_\{ij\}`}</InlineMath>
        is number of rides over the observed period from station <InlineMath>{`i`}</InlineMath> to station <InlineMath>{`j`}</InlineMath>.
        The production matrix <InlineMath>{`B = b_\{ij\}`}</InlineMath> is defined analogously. The production matrix is the transpose of the
        attraction matrix. To calculate the the transition matrix <InlineMath>{`P`}</InlineMath> / <InlineMath>{`Q`}</InlineMath> I
        normalized the attraction / production matrix by the sum of each row.
      </p>
      <BlockMath>{`p_{ij} = \\frac{a_{ij}}{\\sum_{i=1}^na_{ij}}`}</BlockMath>
      <BlockMath>{`q_{ij} = \\frac{b_{ij}}{\\sum_{i=1}^nb_{ij}}`}</BlockMath>
      <p>
        Let's assume that the flow of bikes between stations is aperiodic then for transition matrices it can be calculated
        its long term distribution of bikes at each station, which is the eigenvector of the transition matrix
        with eigenvalue 1 or stationary distribution. The eigenvector <InlineMath>{`\\pi`}</InlineMath> sums up to 1.
      </p>
      <BlockMath>{`\\pi P = \\pi`}</BlockMath>
      <BlockMath>{`\\hat{\\pi} Q = \\hat{\\pi}`}</BlockMath>

      <p>
          This approach is based on the work of Zhou et al. [2], where they used a Markov chain based demand prediction
          model for stations in bike sharing systems in <em>Zhongshan City</em> China.
      </p>

      <h3>Predicting number rides per day</h3>
      <p>
        In the <Link to={"/"}>previous section</Link>, I had showed that the number of rides per day is
        highly dependent on the day of the week, seasonality and weather, e.g. there is ~0.85 correlation with avg.
        temperature.
      </p>
      <p>
        To predict the number of rides per day, I used several models including linear regression, random forest,
        gradient boosting and multilayer neural network with the following features:
      </p>
      <ul>
        <li><strong>Avg. daily temperature</strong> (°C)</li>
        <li><strong>Min. and max. daily temperature</strong> (°C)</li>
        <li><strong>Precipitation</strong> (mm)</li>
        <li><strong>Wind speed and wind gusts</strong> (km/h)</li>
        <li><strong>Atmospheric pressure</strong> (hPa)</li>
        <li><strong>Season</strong> (1 - Spring, 2 - Summer, 3 - Fall, 4 - Winter)</li>
        <li><strong>Month of the year</strong> (1 - January, .., 12 - December)</li>
        <li><strong>Summer holiday</strong> (0 - No, 1 - Yes)</li>
        <li><strong>Holiday</strong> (0 - No, 1 - Yes)</li>
        <li><strong>Workday</strong> (0 - No, 1 - Yes)</li>
      </ul>
      <p>
        The performance of the models was evaluated using the root mean squared error which for the best model was 0.95.
        On the chart below you can see the actual vs. predicted number of rides per day.
      </p>
      <div className={"center"}>
        <img src={rides_prediction} style={{ width: "1000px", marginLeft: "-150px" }} />
      </div>

      <h3>Predicting rents and returns</h3>

      <p>
        The expected number of daily returns / rents from each station can be
        calculated by multiplying the production / attraction stationary
        distribution of probabilities and the total expected number of rides for given day, respectively.
        Let <InlineMath>{`S`}</InlineMath> be the total number of rides per day, then
        the expected number of rents and returns for the station <InlineMath>{`i`}</InlineMath> are:
      </p>
      <BlockMath>{`\\text{Rents}_i = \\pi_i \\times S`}</BlockMath>
      <BlockMath>{`\\text{Returns}_i = \\hat{\\pi}_i \\times S`}</BlockMath>

      <p>
        Following map shows the expected returns and rents for each station. The
        expected number of rides per day can be adjusted in the input field, the
        default value is 675 rides per day, which is the average number for April to September.
      </p>

      <div style={{ width: "1000px", marginLeft: "-150px", textAlign: "center" }}>
        <ul className={"inline"}>
          <li>
            <label htmlFor={"total-rides"}>Expected rides: </label>
            <input
              type={"number"}
              id={"total-rides"}
              value={totalRides}
              style={{ width: "50px" }}
              onChange={(e) => setTotalRides(e.target.value)}
            />
          </li>
          <li>
            <input
              type={"radio"}
              value={"year"}
              id={"radio-year"}
              checked={season === "year"}
              onChange={() => setSeason("year")}
            />
            <label htmlFor={"radio-year"}>Entire year</label>
          </li>
          <li>
            <input
              type={"radio"}
              value={"summer"}
              id={"radio-summer"}
              checked={season === "summer"}
              onChange={() => setSeason("summer")}
            />
            <label htmlFor={"radio-summer"}>Summer (Apr.-Sep.)</label>
          </li>
        </ul>
        <PredictionMap
          rents={productionRates.map((v) => v * totalRides)}
          returns={attractionsRates.map((v) => v * totalRides)}
        />
      </div>

      <span className="image-desc">
        Expected number of rents and returns for each station based on the Markov chain model.
        You can adjust the expected number of rides per day using the input field. The stationary distribution
        is calculated based on the historical rides, you can choose all values or just rides done in April to September.
        By clicking on the station you can see the expected number of rents and returns. <br />
        Hint: To see some discrepancy between the number of rents and returns, try to set the expected number of rides
        to some large number e.g. 10 000.
      </span>

      <h3>Observations</h3>
      <p>
        This model is very simple, it averages all the rides over the observed period and assumes that the flow of bikes
        is going to be the same in the future. It doesn't take into account if the stations are empty or bikes are available.
        Besides that, the model shows which stations are more popular and which are less popular. </p>
      <p>
        Also it uncovers that
        some stations have a slight discrepancy between the number of rents and returns, which could be due to the fact
        that Rekola is doing a some sort of rebalancing (or just general bike repairs), some rides aren't recoded. Finding
        some positive discrepancy on the rent site would suggest that if Rekola rebalances the bikes here it could increase
        the number of rides. On the other hand, finding a negative discrepancy on the rent site would suggest that Rekola
        should move some bikes from this station to another (ideally once with positive rent discrepancy).
      </p>

      <h3 className="reference">References:</h3>
      <ol className="reference">
        <li>
          Richard Durrett. (2016) <em>Essentials of Stochastic Processes</em>.
          3rd edition 2016. Cham: Springer International Publishing.
        </li>
        <li>
          Yajun Zhou, Lilei Wang, Rong Zhong, and Yulong Tan. (2017)
          <em>A Markov Chain Based Demand Prediction Model for Stations in Bike Sharing Systems</em>.
          School of Transportation and Logistics, Southwest Jiaotong University,
          No. 111 North Second Ring Road, Chengdu, Sichuan 610031, China
        </li>
      </ol>
    </>
  );
}

export default MarkovChain;
