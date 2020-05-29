const leftMenu = document.querySelector('.left-menu')
const hamburger = document.querySelector('.hamburger')
const tvShowsList = document.querySelector('.tv-shows__list')
const modal = document.querySelector('.modal')
const tvShows = document.querySelector('.tv-shows')
const searchForm = document.querySelector('.search__form')
const searchFormInput = document.querySelector('.search__form-input')
const tvShowsHead = document.querySelector('.tv-shows__head')
const pagination = document.querySelector('.pagination')


// modal
const tvCardImg = document.querySelector('.tv-card__img')
const modalTitle = document.querySelector('.modal__title')
const genresList = document.querySelector('.genres-list')
const rating = document.querySelector('.rating')
const description = document.querySelector('.description')
const modalLink = document.querySelector('.modal__link ')
const dropdown = document.querySelectorAll('.dropdown')
const posterWrapper = document.querySelector('.poster__wrapper')

// loader

const loading = document.createElement('div')
loading.classList.add('loading')
const loader = document.querySelector('.loadingio-spinner-double-ring-swiq00i6g8f')
loader.style.display = 'none'

// DB
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const SERVER = 'https://api.themoviedb.org/3/'
const API_KEY = '57bf49142bc923cc035a0df257d53feb'


class  DBService {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json()
            
        } else {
            throw new Error(`couldnt get data by adress ${url}`)
        }
        
        
    }

    getTestData =  () => {
        return this.getData('test.json')
        

    }

    getTestCard = () => {
        return this.getData('card.json')
    }

    getSearchResult = query => {
        tvShows.append(loading)
        this.temp = `${SERVER}search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`
        return this.getData(this.temp)
    }

    getNextPage = page => {
        return this.getData(this.temp + '&page=' + page)
    }

    getTvshow = id => {
        return this.getData(`${SERVER}tv/${id}?api_key=${API_KEY}&language=ru-RU`)
    }

    getTopRated = () => {
        tvShows.append(loading)     
        return this.getData(`${SERVER}tv/top_rated?api_key=${API_KEY}&language=ru-RU&page=1`)
        
    }

    getPopular = () => {
        tvShows.append(loading)
        return this.getData(`${SERVER}tv/popular?api_key=${API_KEY}&language=ru-RU&page=1`)
    }

    getToday = () => {
        tvShows.append(loading)        
        return this.getData(`${SERVER}tv/airing_today?api_key=${API_KEY}&language=ru-RU&page=1`)
    }

    getWeek = () => {
        tvShows.append(loading)
        return this.getData(`${SERVER}tv/on_the_air?api_key=${API_KEY}&language=ru-RU&page=1`)
    }

    getLatest = () => {
        tvShows.append(loading)
        return this.getData(`${SERVER}trending/tv/week?api_key=${API_KEY}&language=ru-RU`)
    }

}
const dbService = new DBService()





const renderCard = (response, target) => {
    tvShowsList.textContent = ''
    
    if(!response.total_results) {
        loading.remove()
        tvShowsHead.textContent = 'Ничего не найдено'
        tvShowsHead.style.cssText = 'color: red; text-align: center;'
        return
    }
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:'
    tvShowsHead.style.cssText = 'color: black'

    response.results.forEach(item => {

        const {backdrop_path: backdrop,
            name: title,
            poster_path: poster, 
            vote_average: vote,
            id
        } = item

        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg'
        const backdropImg = backdrop ? IMG_URL + backdrop : ''
        const voteElem = vote ? ` <span class="tv-card__vote">${vote}</span>`  : ''


        const card = document.createElement('li')
        card.classList.add('tv-shows__item')
        card.innerHTML = `
                    <a href="#" id="${id}" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                            src="${posterImg}"
                            data-backdrop="${backdropImg}"
                            alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
        `
        loading.remove()
        tvShowsList.append(card)
        
    })
    
    pagination.textContent = ''

    if(!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
        }
    }
}


{
    dbService.getLatest().then(renderCard)
}

searchForm.addEventListener('submit', event => {
    event.preventDefault()
    const value = searchFormInput.value.trim()
    if (value) {
        dbService.getSearchResult(value).then(renderCard)
    }
    searchFormInput.value = ''
    
})


// menu
const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active')
    })
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu')
    hamburger.classList.toggle('open')
    closeDropdown()
})

document.addEventListener('click', (event) => {
    if(!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu')
        hamburger.classList.remove('open')
    }
})

leftMenu.addEventListener('click', (event) => {
    event.preventDefault()
    const target = event.target
    const dropdown = target.closest('.dropdown')
    if (dropdown) {
        dropdown.classList.toggle('active')
        leftMenu.classList.add('openMenu')
        hamburger.classList.add('open')
    }


    if(target.closest('#top-rated')) {
        dbService.getTopRated().then((response) => renderCard(response, target))
        // leftMenu.classList.remove('openMenu')
        // hamburger.classList.remove('open')
    }

    if(target.closest('#popular')) {
        dbService.getPopular().then((response) => renderCard(response, target))
        // leftMenu.classList.remove('openMenu')
    }   

    if(target.closest('#today')) {
        dbService.getToday().then((response) => renderCard(response, target))
        // leftMenu.classList.remove('openMenu')

        
    }   

    if(target.closest('#week')) {
        dbService.getWeek().then((response) => renderCard(response, target))
        // leftMenu.classList.remove('openMenu')
    }

})


tvShowsList.addEventListener('click', (event) => {
    event.preventDefault()
    const target = event.target
    const card = target.closest('.tv-card')

    if(card) {

        loader.style.display = 'inline-block'
        
        dbService.getTvshow(card.id)
            .then(data => {
                if(data.poster_path) {
                    tvCardImg.src = IMG_URL + data.poster_path 
                    tvCardImg.alt = data.name
                } else {
                    tvCardImg.src = 'img/no-poster.jpg'
                }
                modalTitle.textContent = data.name
                genresList.textContent = ''
                genresList.style.textTransform = 'lowercase'
                data.genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`
                })
                rating.textContent = data.vote_average
                description.textContent = data.overview
                modalLink.href = data.homepage
                
            })
            .then(() => {
                document.body.style.overflow = 'hidden'
                modal.classList.remove('hide')
                loader.style.display = 'none'
                
            })
            .finally(() => {
                loader.style.display = 'none'
            }) 
    }
})

modal.addEventListener('click', (event) => {
    if(event.target.closest('.cross') || 
        event.target.classList.contains('modal')) {
        document.body.style.overflow = ''
        modal.classList.add('hide')
    }
})

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item')

    if(card) {
        const img = card.querySelector('.tv-card__img')
        if(img.dataset.backdrop) {
            [img.dataset.backdrop, img.src] = [img.src, img.dataset.backdrop]
        }
    }
}

tvShowsList.addEventListener('mouseover', changeImage)
tvShowsList.addEventListener('mouseout', changeImage) 

pagination.addEventListener('click', (event) => {
    event.preventDefault()
    const target = event.target
    if(target.classList.contains('pages')) {
        tvShows.append(loading)
        dbService.getNextPage(target.textContent).then(renderCard)
    }
})