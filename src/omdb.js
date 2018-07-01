import axios from 'axios'

class Omdb {

    constructor () {
        this.url = 'http://www.omdbapi.com/'
        this.key = 'a999d662'
        this.type = 'movie'
        this.format = 'json'
        this.url = `${this.url}?apikey=${this.key}&type=${this.type}&r=${this.format}`
    }

    // YOLO: add local storage to cache the search and results

    search (text = '') {
        return new Promise((resolve, reject) => {
            const parsedText = text.replace(/\s/gm, '+')
            const url = `${this.url}&s=${parsedText}`
            axios.get(url)
                .then(response => {
                    try {
                        const results = response.data['Search']
                        const data = results.reduce((filtered, movie) => {
                            const formatted = {
                                title: movie['Title'],
                                year: movie['Year'],
                                id: movie['imdbID'],
                                image: movie['Poster']
                            }
                            return [...filtered, formatted]
                        }, [])
                        resolve(data)
                    } catch (error) {
                        reject(error)
                    }
                })
                .catch(error => reject(error))
        })
    }

    getMovie (id = '') {
        return new Promise((resolve, reject) => {
            const url = `${this.url}&i=${id}`
            axios.get(url)
                .then(response => {
                    try {
                        const duration = response.data['Runtime'].split(' ')[0]
                        const data = {
                            id: response['imdbID'],
                            title: response['Title'],
                            year: Number(response['Year']),
                            duration: Number(duration),
                            genre: response.toLowerCase().replace(/\s/mg,'').split(','),
                            director: response['Director'],
                            actors: response['Actors'],
                            country: response['Country'],
                            image: response['Poster'],
                            metascore: Number(response['Metascore']),
                            imdbRating: Number(response['imdbRating'])
                        }
                        resolve(data)
                    } catch (error) {
                        reject(error)
                    }
                })
                .catch(error => reject(error))
        })
    }

}

export default new Omdb()