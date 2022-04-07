import { Player } from "./player.js";

document.addEventListener('DOMContentLoaded', () => {

    const player = new Player(document.querySelector('#player'));
    window.player = player;

    const searchButton = document.getElementById("searchbutton");
    let searchHidden = true
    
    searchButton.addEventListener("click", () => {
        if (searchHidden) {
            document.querySelector(".search-bar").classList.remove("hidden");
            document.querySelector(".top-text").classList.add("hidden");
            searchHidden = false;
        } else {
            if (document.querySelector(".search-bar").value != "") {
                window.location.href = `/search?q=${document.querySelector(".search-bar").value.replaceAll(' ', '+')}`
            }
            document.querySelector(".search-bar").classList.add("hidden");
            document.querySelector(".top-text").classList.remove("hidden");
            searchHidden = true;
        }
    });

})