import Brain from 'brain.js'

const network = new Brain.NeuralNetwork()

/**
 * ana
 * adrian
 * aritz
 * david
 * elena
 * { input: { title: 'Shutter Island', year: 2010, rate: 8.1, min: 138, genre: ['Mistery', 'Thriller'] }, output: { ana: 1, adrian: 1, aritz: 0, david: 1, elena: 1 }},
    { input: { title: 'Farenheit 451', year: 1966, rate: 7.3, min: 112, genre: ['Drama', 'Sci-Fi'] }, output: { ana: 1, adrian: 0, aritz: 1, david: 1, elena: 0 }},
    3,7,11
 */

network.train([
    { input: { year: 2010, rate: 8.1, min: 138 }, output: { ana: 1, adrian: 1, aritz: 0, david: 1, elena: 1 }},
    { input: { year: 1966, rate: 7.3, min: 112 }, output: { ana: 1, adrian: 0, aritz: 1, david: 1, elena: 0 }},
])

network.evaluateMovie = movie => {
    const input = {
        year: Number(movie.year),
        imdbRating: Number(movie.imdbRating),
        metascore: Number(movie.metascore),
        // country: getCountryValue(movie.country),
        // genre: getGenresValue(movie.genre),
        duration: Number(movie.duration)
    }
    const prediction = network.run(input)
    const formatted = Object.entries(prediction).reduce((result, [key, value]) => {
        const tmp = {}
        tmp[key] = Number(value.toFixed(2))
        return Object.assign({}, result, tmp)
    }, {})
    return formatted
}

export default network