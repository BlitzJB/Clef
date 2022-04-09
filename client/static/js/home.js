function loadLastSongData() {
    console.log("loadLastSongData");
    if ('lastSong' in localStorage) {
        console.log(`loadLastSongData: found ${localStorage.lastSong}`);
        const song = JSON.parse(localStorage.lastSong);
        const lastSongContainer = document.querySelector('#lastsong')
        let div = document.createElement('div');
        div.innerHTML = `
        <h4 class="action__title">Continue Listening</h4>
        <div class="row" style="padding: 0px;border-color: var(--bs-body-color)">
            <div class="col-auto"><img src="${song.thumbnail.mini}" width="60"></div>
            <div class="col">
                <div class="row">
                    <div class="col-10" style="padding-right: 0;">
                        <h5>${song.title}</h5>
                    </div>
                    <div class="col-2 text-end align-self-center minicard-action"><i class="fa fa-play fs-4 text-start" ></i></div>
                    <div class="col-10" style="padding-right: 0;">
                        <p style="font-size: 13px;">${song.artists.join(', ')}</p>
                    </div>
                    <div class="col-2" ">
                        <p class="text-end" >${song.length}</p>
                    </div>
                </div>
            </div>
        </div>
        `
        div.classList.add('action');
        div.addEventListener('click', () => {
            window.location.href = `/song?id=${song.id}`
        })
        lastSongContainer.appendChild(div);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchbutton");
    const searchBox = document.querySelector(".search-bar");
    
    searchButton.addEventListener("click", () => {
        if (searchBox.value != "") {
            window.location.href = `/search?q=${searchBox.value.replaceAll(' ', '+')}`
        }
    })

    loadLastSongData();
});
