import { getQueryVariable } from "./utils.js";



function loadSearchResults() {


    
    const searchFor = document.querySelector(".search-for");
    const resultContainer = document.querySelector(".results__container");

    

    const query = getQueryVariable("q");
    if (!query) {
        searchFor.innerHTML = "Use the search bar above to search";
        return
    }

    searchFor.innerHTML = "Loading...";

    function trimString(string) {
        if (string.length > 25) {
            return `${string.substring(0, 25)}...`
        } else {
            return string
        }
    }

    
    fetch(`https://ytmusic-interactions.blitzsite.repl.co/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            searchFor.innerHTML = `Search results for "${query.replaceAll('+', ' ')}"`;
            data.forEach(item => {
                const template = `
                    <div class="row" style="padding: 0px;border-color: var(--bs-body-color);margin-bottom: 14px;">
                    <div class="col-auto"><img src="${item.thumbnail.mini}" width="60"></div>
                    <div class="col">
                        <div class="row">
                            <div class="col-10" style="padding-right: 0;">
                                <h5>${trimString(item.title)}</h5>
                            </div>
                            <div class="col-2 text-end align-self-center" style="padding: 0;"><i class="fa fa-play fs-4 text-start go" style="color: var(--bs-gray-dark);"></i></div>
                            <div class="col-10" style="padding-right: 0;">
                                <p style="font-size: 13px;">${trimString(item.artists.join(', '))}</p>
                            </div>
                            <div class="col-2" style="padding: 0;">
                                <p class="text-end" style="padding: 0;">${item.length}</p>
                            </div>
                        </div>
                    </div>
                </div>`
                const li = document.createElement("li");
                li.classList.add("result");
                li.innerHTML = template;
                li.addEventListener("click", () => {
                    window.location.href = `/song?id=${item.id}`
                })
                resultContainer.appendChild(li);
            })
        })

}   

document.addEventListener("DOMContentLoaded", () => {
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
    loadSearchResults();
});