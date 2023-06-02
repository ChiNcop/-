

const API_KEY = '8a91212f-251a-46ed-89c2-08e085db7629'
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api'
const API_URL_POPULAR = BASE_URL + '/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page='
const API_URL_SEARCH = BASE_URL + '/v2.1/films/search-by-keyword?keyword='
const API_DETAILS = BASE_URL + '/v2.2/films/'
const SIMILARS = '/similars'


const output = document.querySelector('.output')
const paginationWrap = document.querySelector('.paginationWrap')
const form = document.querySelector('form')
const input = document.querySelector('input')
const tops = document.querySelector('.top')



//states
let activeBtn = 1
let state = ''
//states

const renderPagination = (pagesCount) => {
    const limit = 20
    if (pagesCount === 1) {
        paginationWrap.innerHTML = ''
    } else if (pagesCount <= limit) {
        pagination(pagesCount)
    } else {
        pagination(limit)
    }
}

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
        renderPagination(response.pagesCount)
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
        const krug = document.createElement('div')
        const img = document.createElement('img')
        const text = document.createElement('h6')
        const name = document.createElement('p')

        div.className = 'film'
        krug.className = 'krug'
        text.className = 'janr'
        
        text.textContent = res
        name.textContent = el.nameRu
        img.src = el.posterUrl
       
        div.addEventListener('click', () => {
            output.innerHTML = ''
            getDiteils(el.filmId)
        })

        krug.append()
        div.append(img, name, text)
        output.append(div)
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

            tops.addEventListener('click', () => {
                getMovies(API_URL_POPULAR)
                activeBtn = 1
            })
        })
        paginationWrap.append(button)
    })

}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    state = input.value

    getMovies(API_URL_SEARCH + input.value)
})

const getDiteils = async (id) => {
    try {
        const request = await fetch(API_DETAILS + id, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(id);
        console.log(response);
        renderDiteils(response.description, response.posterUrl)



    } catch (e) {
        console.log(e)
    }
}

const renderDiteils = (text, image) => {
    const p = document.createElement('p')
    const img = document.createElement('img')
    const btn = document.createElement('button')

    btn.className = 'btn'
    img.className = 'image'

    btn.textContent = 'clicl'
    img.src = image
    p.textContent = text
    

    btn.addEventListener('click', () => {
        if (input.value) {
            getMovies(API_URL_SEARCH + input.value );
          } else {
            getMovies(API_URL_POPULAR + activeBtn);
          }
    })

    output.append(p, img, btn)
}


