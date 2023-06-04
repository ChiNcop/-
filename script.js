

const API_KEY = '8a91212f-251a-46ed-89c2-08e085db7629'
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api'
const API_URL_POPULAR = BASE_URL + '/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page='
const API_URL_SEARCH = BASE_URL + '/v2.1/films/search-by-keyword?keyword='
const API_DETAILS = BASE_URL + '/v2.2/films/'
const SIMILARS = '/similars'
const awards = '/awards'


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

const janry = (el) => {
    const result = el.genres.map(el => {
        return el.genre
    })
    const res = result.join(' ')
    return res
}


const renderMovies = (data) => {
    output.innerHTML = ''
    data.forEach(el => {
        const div = document.createElement('div')
        const krug = document.createElement('div')
        const img = document.createElement('img')
        const text = document.createElement('h6')
        const name = document.createElement('p')

        div.className = 'film'
        krug.className = 'krug'
        text.className = 'janr'
        text.textContent = janry(el)
        name.textContent = el.nameRu
        img.src = el.posterUrl

        div.addEventListener('click', () => {
            output.innerHTML = ''
            getDiteils(el.filmId)
            getAwards(el.filmId)
            getAlt(el.filmId)
            
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


        })
        paginationWrap.append(button)
    })

}

tops.addEventListener('click', () => {
    getMovies(API_URL_POPULAR)
    activeBtn = 1
    state = ''
    input.value = ''
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    state = input.value
    activeBtn = 1

    getMovies(API_URL_SEARCH + state)

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
    const box = document.createElement('div')

    btn.className = 'btn'
    img.className = 'image'

    btn.textContent = 'clicl'
    img.src = image
    p.textContent = text


    btn.addEventListener('click', () => {
        if (input.value) {    
            getMovies(API_URL_SEARCH + state + '&page=' + activeBtn)  
        } else {
            getMovies(API_URL_POPULAR + activeBtn);
        }
    })

    box.append(p, img, btn)
    output.append(box)
}

const getAlt = async (id) => {
    try {
        const request = await fetch(API_DETAILS + id + SIMILARS, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(response);
        renderAlt(response.items)

    } catch (e) {
        console.log(e)
    }

}

const renderAlt = (arr) => {
    const result = arr.forEach(el => {
        const name = document.createElement('p')
        const img = document.createElement('img')
        const box = document.createElement('div')

        box.className = 'boxAlt'

        name.textContent = el.nameOriginal
        img.src = el.posterUrl

        box.addEventListener('click', () => {
            output.innerHTML = ''
            getDiteils(el.filmId)
            getAlt(el.filmId)
        })

        box.append(img, name)
        output.append(box)
    })
}



const getAwards = async (id) => {
    try {
        const request = await fetch(API_DETAILS + id + awards, {
            headers: {
                'X-API-KEY': API_KEY,
            },
        })
        const response = await request.json()
        console.log(response)
        renderAwards(response.items)

    } catch (e) {
        console.log(e)
    }

}

const renderAwards = (arr) => {
    const result = arr.forEach(el => {
        const nameAwards = document.createElement('p')
        const year = document.createElement('p')
        const box = document.createElement('div')
    
        nameAwards.textContent = el.nominationName
        year.textContent = el.year
    
        box.append(nameAwards, year)
        output.append(box)
    })
}


