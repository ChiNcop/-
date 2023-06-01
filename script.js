

const API_KEY = '2cd798da-5e96-44c1-a38a-8f4c17788b03'
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api'
const API_URL_POPULAR = BASE_URL + '/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page='
const API_URL_SEARCH = BASE_URL + '/v2.1/films/search-by-keyword?keyword='
const API_DETAILS = BASE_URL + '/v2.2/films/'
const SIMILARS = '/similars'


const output = document.querySelector('.output')
const paginationWrap = document.querySelector('.paginationWrap')
const form = document.querySelector('form')
const input = document.querySelector('input')


//states
let activeBtn = 1
let state = ''
let stranitsa
//states

const getMovies = async (url) => {
    try {
        const request = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(response);
        
        renderMovies(response.films)
        pagination(response.pagesCount)
    } catch (e) {
        console.log(e)
    }
}
getMovies(API_URL_POPULAR)


const renderMovies = (data) => {
    output.innerHTML = ''
    data.forEach(el => {
        const result = el.genres.map(el => {
            return el.genre
        })
        const res = result.join(' ')
        const div = document.createElement('div')
        div.className = 'film'
        const krug = document.createElement('div')
        krug.className = 'krug'
        const img = document.createElement('img')
        const text = document.createElement('h6')
        text.className = 'janr'
        const name = document.createElement('p')
        text.textContent = res
        name.textContent = el.nameRu
        img.src = el.posterUrl
        krug.append()
        div.append(img, name, text)
        output.append(div)
        div.addEventListener('click', () => {
            output.innerHTML = ''
            getText(el.filmId)
        })
    })

}

const pagination = (num) => {
    paginationWrap.innerHTML = ''
    const paginationNumbers = []
    for (let i = 1; i <= num; i++) {
        paginationNumbers.push(i)
    }
    paginationNumbers.forEach(el => {
        const button = document.createElement('button')
        button.className = el === activeBtn ? 'active' : ''
        button.textContent = el
        button.addEventListener('click', () => {

            activeBtn = el
            

            state ? getMovies(API_URL_SEARCH + state + '&page=' + el)
                : getMovies(API_URL_POPULAR + el)
        })
        paginationWrap.append(button)
    })

}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    state = input.value

    getMovies(API_URL_SEARCH + input.value)
})

const getText = async (id) => {
    try {
        const request = await fetch(API_DETAILS + id, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(id);
        console.log(response);
        renderText(response.description, response.posterUrl)



    } catch (e) {
        console.log(e)
    }
}

const renderText = (text, image) => {
    const p = document.createElement('p')
    const img = document.createElement('img')
    const btn = document.createElement('button')
    btn.textContent = 'clicl'
    btn.className = 'btn'
    img.className = 'image'
    img.src = image
    p.textContent = text
    output.append(p, img, btn)

    btn.addEventListener('click', () => {
        getMovies(API_URL_POPULAR + activeBtn)
    })
}

const tops = document.querySelector('.top')
tops.addEventListener('click', () => {
    getMovies(API_URL_POPULAR)
})

