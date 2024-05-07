import React from "react";

function Home() {
  return (
    <>
      <h2>1. Intro</h2>
      <p>
        Rekola [1] is a bike-sharing service operating in Bratislava and some
        other places in Czech Republic such as Prague. Their signature pink
        coloured bikes are distributed all over the wider city center and
        available to registered users for short-term rental (up to 24 hours).
        Users, then can see and use all the available bikes at the fixed
        stations.
      </p>

      <p>
        In this project I will look at mobility patterns uncovered by Rekola bike-sharing service in Bratislava,
        describe basic user behaviour within the city boundaries and try to predict the demand for bike-sharing. This
        project has 4 parts and it is related to my previous project about Bratislava cyclo infrastructure,
        &nbsp;<a href={"https://matejker.github.io/cyklo-bratislava/#/"}>Cyclo Bratislava</a>.
      </p>

      <p>
        Firstly, I will take a look at the mobility patterns and describe the data used for the further analysis.
      </p>

      <p>
        Secondly, Rekola has a lot of stations in Bratislava. In order to makes some prediction I find it useful to
        reduce the number of stations. I will describe the clustering methods used to reduce the number of stations.
      </p>

      <p>
        Thirdly, to give some sort of idea where bikes are rented and returned, I will use Markov chains to describe very
        basic user behaviour.
      </p>

      <p>
        Finally, however the rides are not evenly distributed over the day and the popularity of the stations is chaining
        over the day, and to better understand the behaviour at the station level I will model each station supply and
        demand as a stochastic process. More specifically, I will use Poisson process and queueing theory to model the
        number of bikes arriving and leaving the stations.
      </p>

      <p>
        This project tries to provide some basic understanding of the bike-sharing service in Bratislava and hints some
        ideas how to adjust the number of bikes at the stations to better serve the users.
      </p>

      <h3 className="reference">References:</h3>
      <ol className="reference">
        <li>
          Rekola Bikesharing SK s.r.o.,&nbsp;
          <em>"Rekola - Discover city with Rekola Bikesharing</em>,&nbsp;
          <a href="https://www.rekola.sk/">link</a>
        </li>
      </ol>
    </>
  );
}

export default Home;
