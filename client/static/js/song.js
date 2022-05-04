import { Player } from "./player.js";
import { KeyBindHandler } from "./keybindHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const player = new Player(document.querySelector("#player"));
    window.player = player;

    new KeyBindHandler(player);
    const searchButton = document.getElementById("searchbutton");
    let searchHidden = true;

    searchButton.addEventListener("click", () => {
        if (searchHidden) {
            document.querySelector(".search-bar").classList.remove("hidden");
            document.querySelector(".top-text").classList.add("hidden");
            searchHidden = false;
        } else {
            if (document.querySelector(".search-bar").value != "") {
                window.location.href = `/search?q=${document.querySelector(".search-bar").value.replaceAll(" ", "+")}`;
            }
            document.querySelector(".search-bar").classList.add("hidden");
            document.querySelector(".top-text").classList.remove("hidden");
            searchHidden = true;
        }
    });

    const more_actions = document.querySelector(".action-more");
    more_actions.addEventListener("click", () => {
        const actions = document.querySelector(".actions-list");
        if (actions.classList.contains("hidden")) {
            actions.classList.remove("hidden");
        } else {
            actions.classList.add("hidden");
        }
    });

    document.getElementById("share").addEventListener("click", () => {
        document.getElementById("share").innerHTML = '<span style="font-size: .8em; position: absolute; top: -22px; left:-20px; width: max-content; padding: 7px 10px; background-color: rgba(40,40,40,.5); border: 1px solid rgba(180,180,180,.5); border-radius: 10px">Copied Link!</span>';
        setTimeout(() => {
            document.getElementById("share").innerHTML = '<i class="fa fa-share"></i>';
        }, 1000);
        navigator.clipboard.writeText(window.location.href.replace("/song", "/share"));
    });
});
