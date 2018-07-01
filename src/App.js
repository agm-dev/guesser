import React from 'react'
import ReactDOM from 'react-dom'
import network from './network'
import omdb from './omdb'

class Title extends React.Component {
    render() {
        return <h1>Cinegram Guesser</h1>
    }
}

class Description extends React.Component {
    render() {
        return <p>Introduce a movie and the application will predict if it will like or not to Cinegramers based on the watched movies</p>
    }
}

class ResultsBox extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="search-results">
                <h2>Results box</h2>
                <ul>
                    {this.props.movies.map(movie => {
                        // YOLO: return MovieCard or something like that instead
                        return (
                            <li
                                key={movie.id}
                                onClick={() => this.props.proposedHandler(movie)}
                            >{movie.title} ({movie.year})</li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            results: [],
            text: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.keyPress = this.keyPress.bind(this)
        this.getMovies = this.getMovies.bind(this)
    }

    render() {
        return (
            <div>
                <input className="search" type="text" value={this.state.text} placeholder="Type a movie title..." onKeyPress={this.keyPress} onChange={this.handleChange} />
                <ResultsBox movies={this.state.results} proposedHandler={this.props.proposedHandler} />
            </div>
        )
    }

    handleChange(event) {
        event.persist()
        this.setState(
            prevState => ({ text: event.target.value }),
            () => console.log(`Search: ${event.target.value}`)
        )
    }

    keyPress(event) {
        if (event.key === 'Enter') { // enter key
            this.getMovies(this.state.text)
        }
    }

    getMovies(text) {
        console.log(`Searching ${text}...`)
        omdb.search(this.state.text)
            .then(results => {
                console.log(`Search has ended!`)
                this.setState(prevState => ({ results }))
            })
            .catch(error => console.error(error))
    }
}

class Test extends React.Component {
    constructor(props) {
        super(props)
        this.evaluate = this.evaluate.bind(this)
    }
    render() {
        return <button onClick={this.evaluate}>Click!</button>
    }

    evaluate() {
        const prediction = network.run({ year: 2005, rate: 8.0, min: 124 })
        console.log(`Prediction: ${JSON.stringify(prediction)}`)
    }
}

class History extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                { title: '12 hombres sin piedad', ratings: { ana: 1, adrian: 1, aritz: 1, david: 1, elena: 1 } },
                { title: 'Olvídate de mí', ratings: { ana: 0, adrian: 1, aritz: 1, david: 1, elena: 1 } },
            ]
        }
    }
    render() {

        let proposedMovieHtml = ''
        let movie = this.props.proposed
        let movies = this.state.history

        if (typeof movie.title !== 'undefined') {
            movies = [movie, ...movies]
        }

        return (
            <table className="">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Ana</th>
                        <th>Adrián</th>
                        <th>Aritz</th>
                        <th>David</th>
                        <th>Elena</th>
                    </tr>
                </thead>
                <tbody>
                    { movies.map((movie, index) => (
                        <tr key={index} className={movie.proposed ? 'proposed-movie' : ''}>
                            <td>{movie.title}</td>
                            <td>{movie.ratings.ana}</td>
                            <td>{movie.ratings.adrian}</td>
                            <td>{movie.ratings.aritz}</td>
                            <td>{movie.ratings.david}</td>
                            <td>{movie.ratings.elena}</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        )
    }
}

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            proposedMovie: {}
        }
        this.changeProposed = this.changeProposed.bind(this)
    }

    changeProposed(movie) {
        movie.ratings = this.getRatings(movie)
        movie.proposed = true
        this.setState(
            prevState => ({ proposedMovie: movie }),
            () => console.log(`changed proposed movie to ${this.state.proposedMovie.title}`)
        )
    }

    getRatings(movie) {
        const prediction = network.evaluateMovie(movie)
        console.log(`Prediction: ${JSON.stringify(prediction)}`)
        return prediction
    }

    render() {
        return (
            <div>
                <Title/>
                <Description/>
                <Search proposedHandler={this.changeProposed} />
                <History proposed={this.state.proposedMovie}/>
            </div>
        )
    }
}

export default App

