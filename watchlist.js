const containerData = document.getElementById("container-data")
let moviesListStorage = []

function render(){
    if (localStorage.getItem('moviesList')) {
        moviesListStorage = JSON.parse(localStorage.getItem('moviesList'))
        renderWatchlist()
    }else{
        renderNoMovies()
    }
}


document.addEventListener("click",e=>{
    if(e.target.dataset.delete){
        handleClickDeleteMovie(e.target.dataset.delete)
    }
})

function saveToLocalStorage(){
    localStorage.setItem('moviesList', JSON.stringify(moviesListStorage));
}

function handleClickDeleteMovie(movieId){
    const index = moviesListStorage.findIndex(element => element.id === movieId)
    moviesListStorage.splice(index,1)
    saveToLocalStorage()
    if(JSON.parse(localStorage.getItem('moviesList')).length === 0){
        localStorage.removeItem('moviesList')
    }
    render()
}




function renderNoMovies(){
    containerData.innerHTML = `
    <h2 class="start-text">Unable to find what you’re looking for.<br> Please try another search.</h2>
    <a href="index.html" class="add-movies"><i class="fa-solid fa-circle-plus"></i> Let’s add some movies!</a>
    `
}


console.log(moviesListStorage)

function renderWatchlist(){
    let moviesHTML = ""
    moviesListStorage.forEach(movie =>{
        moviesHTML +=`
        <div class="movie-container">
            <img src="${movie.poster==="N/A"? "img/poster-placeholder.png":movie.poster}" class="poster-movie"/>
            <div class="info-movie">
                    <div class="title-rate">
                        <h3 class="title-movie">${movie.title}</h3>
                        <h4 class="rating-movie"><i class="fa-solid fa-star"></i> ${movie.rating}</h4>
                    </div>
                    <div class="run-cat-btn">
                        <h4 class="runtime-movie">${movie.runtime}</h4>
                        <h4 class="genre-movie">${movie.genre}</h4>
                        <button class="btn-watchlist" data-delete="${movie.id}"><i class="fa-solid fa-circle-minus"></i> Remove</button>
                    </div>
                    <p class="plot-movie">${movie.plot}</p>
            </div>
        </div>
    `
    })
            containerData.innerHTML = `
                <lottie-player src="https://assets4.lottiefiles.com/packages/lf20_j1adxtyb.json"  background="transparent"  speed="1"  style="width: 150px; height: 150px;"  loop autoplay></lottie-player>
                `
            setTimeout(()=>{
                containerData.innerHTML = moviesHTML
            },1000)
}

render()