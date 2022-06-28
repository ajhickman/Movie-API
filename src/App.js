import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      upcoming: [],
      trailers: [],
    }
  }
  

  componentDidMount() {
    // this is where you load things from the internet
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=b6fbc7f3f313bd395902af464ef47262&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate')
      .then(response => response.json())
      .then(data => {
        const results = data.results
        this.setState({
          movies: results
        })

        //This section very much under construction. Will grab some links but only some. Likely needs repositioned.
        for (let i = 0; i < results.length; i++){
          
          const url=`https://api.themoviedb.org/3/movie/${results[i].id}/videos?api_key=b6fbc7f3f313bd395902af464ef47262&language=en-US`;
  
          fetch(url)
            .then(response => response.json())
            .then(data => {
              const newTrailerUrls = data.results.map(
                res => `https://www.youtube.com/watch?v=${res.key}`)
              const newTrailerObj = {
                title: results[i].title,
                trailerUrls: newTrailerUrls
              }
              const trailers = this.state.trailers.concat([newTrailerObj])
              this.setState({
                trailers: trailers
              })
            })
        }
      })
    fetch('https://api.themoviedb.org/3/movie/upcoming?api_key=b6fbc7f3f313bd395902af464ef47262&language=en-US&page=1')
      .then(res => res.json())
      .then(data => this.setState({
        upcoming: data.results
      }))
  }
  render() {
    const movies = [];
    for(let i = 0; i < this.state.movies.length; i++)
    {

      movies.push(
        <div key={`movie-${i}`}>
          <div className = "container"> 
            <div className = "posterContainer">
              <p className = "description"> {this.state.movies[i].overview}</p>
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/original/${this.state.movies[i].poster_path}`}
                alt={this.state.movies[i].title}
              />
            </div>
          </div>
            <p className = "titles">{this.state.movies[i].title}</p>
        </div>)
    }

    const upcoming = [];
    for(let i = 0; i < this.state.upcoming.length; i++)
    {

      upcoming.push(
        <div key={`upcoming-${i}`}>
          <div className = "container"> 
            <div className = "posterContainer">
              <p className = "description">
                {this.state.upcoming[i].overview}
              </p>
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/original/${this.state.upcoming[i].poster_path}`}
                alt={this.state.upcoming[i].title}
              />
            </div>
          </div>
          <p className = "titles">
            {this.state.upcoming[i].title}
          </p>
        </div>
      )
    }

    const trailerStuff = this.state.trailers.map(trailer => {
      return (
        <li>
          <p>{trailer.title}</p>
          <ul>
            {trailer.trailerUrls.map(url => <li><a href={url}>{url}</a></li>)}
          </ul>
        </li>
      )
    })

    return (
      <div className="App">
        <h1 className = "SectionTitle">
          Top 20 Movies Currently in Theatres (near u)
        </h1>
        <div className="MoviesContainer">
          <div className="Movies">
            {movies}
          </div>
        </div>
        <h1 className = "SectionTitle">
          20 Upcoming Moovies
        </h1>
        <div className="MoviesContainer">
          <div className="Movies">
            {upcoming}
          </div>
        </div>
        {/* <div>
          <ul>
            {trailerStuff}
          </ul>
        </div> */}
      </div>
    );
  }
}

export default App;
