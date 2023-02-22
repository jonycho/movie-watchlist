const searchText = document.getElementById("search-text")
const formSearch = document.getElementById("container-form")
const containerData = document.getElementById("container-data")


document.addEventListener("click",(e)=>{
    if(e.target.dataset.id){
        const containerBtn = document.getElementById(`container-btn-${e.target.dataset.id}`)
        handleClickMovie(e.target.dataset.id)
        containerBtn.innerHTML = `<button class="btn-watchlist" data-delete="${e.target.dataset.id}"><i class="fa-solid fa-circle-check"></i> Added</button>`
    }else if(e.target.dataset.delete){
        const containerBtn = document.getElementById(`container-btn-${e.target.dataset.delete}`)
        handleClickDeleteMovie(e.target.dataset.delete)
        containerBtn.innerHTML =`<button class="btn-watchlist" data-id="${e.target.dataset.delete}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>`
    }    
})

let moviesListStorage = []
    if (localStorage.getItem('moviesList')) {
        moviesListStorage = JSON.parse(localStorage.getItem('moviesList'))
    }


function saveToLocalStorage(){
    localStorage.setItem('moviesList', JSON.stringify(moviesListStorage));
}

function handleClickMovie(movieId){
    fetch(`https://www.omdbapi.com/?apikey=2272d9fe&i=${movieId}`)
        .then(res=>res.json())
        .then(data=> {
            moviesListStorage.push({
                id: data.imdbID,
                title: data.Title,
                rating: data.imdbRating,
                runtime: data.Runtime,
                poster: data.Poster,
                genre: data.Genre,
                plot: data.Plot
            })
            saveToLocalStorage()
        })
}

function handleClickDeleteMovie(movieId){
    const index = moviesListStorage.findIndex(element => element.id === movieId)
    moviesListStorage.splice(index,1)
    saveToLocalStorage()
}


function getDataMovies(){
    fetch(`https://www.omdbapi.com/?apikey=2272d9fe&s=${searchText.value}&type=movie`)
        .then(res=>res.json())
        .then(data=> {
            if(data.Response==="True"){
                getMovie(data.Search)    
            }else{
                renderNoMoviesFound()
            }
        })
}

function renderNoMoviesFound(){
    containerData.innerHTML = `<h2 class="start-text">Unable to find what you’re looking for.<br> Please try another search.</h2>`
    searchText.value = ""
}

function getMovie(movies){
    let moviesHTML = ""
    for(let movie of movies){
        fetch(`https://www.omdbapi.com/?apikey=2272d9fe&i=${movie.imdbID}`)
            .then(res=>res.json())
            .then(data=>{
                if(!data.Genre.includes("Short")){
                    
                    const foundId = moviesListStorage.find(element => element.id === data.imdbID);
               
               moviesHTML +=`
                    <div class="movie-container">
                        <img src="${data.Poster==="N/A"? "img/poster-placeholder.png":data.Poster}" class="poster-movie"/>
                        <div class="info-movie">
                                <div class="title-rate">
                                    <h3 class="title-movie">${data.Title}</h3>
                                    <h4 class="rating-movie"><i class="fa-solid fa-star"></i> ${data.imdbRating}</h4>
                                </div>
                                <div class="run-cat-btn">
                                    <h4 class="runtime-movie">${data.Runtime}</h4>
                                    <h4 class="genre-movie">${data.Genre}</h4>
                                    <div id="container-btn-${data.imdbID}">
                                        ${foundId ? `<button class="btn-watchlist" data-delete="${data.imdbID}"><i class="fa-solid fa-circle-check"></i> Added</button>`: `<button class="btn-watchlist" data-id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>`}
                                    </div>
                                </div>
                                <p class="plot-movie">${data.Plot}</p>
                        </div>
                    </div>
                `}
                containerData.innerHTML = `
                <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json"  background="transparent"  speed="1"  style="width: 150px; height: 150px;"  loop autoplay></lottie-player>
                `
                setTimeout(()=>{
                    containerData.innerHTML = moviesHTML
                },2000)
                
            })
    }
}

formSearch.addEventListener("submit",function(e){
        e.preventDefault()
        getDataMovies()
    })
