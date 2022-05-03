import { getQueryVariable } from "./utils.js";

export class Player {

    constructor (parent) {

        this.baseurl = "https://ytmusic-interactions.blitzsite.repl.co/"

        this.currentId = null;
        this.recom = null;
        this.ispaused = true;
        this.islooping = false;
        this.getAudioElement();
        this.initialLoad();

        this.UI = {
            songTitle: document.querySelector('.track__title'),
            songArtist: document.querySelector('.track__artist'),
            thumbnail: document.querySelector('.track__thumbnail'),
            prev: document.querySelector('#prev'),
            next: document.querySelector('#next'),
            play: document.querySelector('#play'),
            loop: document.querySelector('#loop'),
            recommendations: document.querySelector('#recommendations'),
            progressBar: document.querySelector('#prog'),
            currentTime: document.querySelector('#currenttimestamp'),
            totalTime: document.querySelector('#totaltimestamp'),
            download: document.querySelector('#download')
        }

        this.UI.prev.addEventListener('click', () => {
            this.handlePrev();
        })

        this.UI.next.addEventListener('click', () => {
            this.handleNext();
        })

        this.UI.play.addEventListener('click', () => {
            if (this.ispaused) {
                this.play();
                this.UI.play.innerHTML = '<div class="col fs-4 text-center align-self-center" id="play"><button class="btn btn-link btn-circle" style="border-radius: 50px;background: var(--secondary );border: .1px solid var(--primary);" type="button"><i class="fa fa-pause" style="color: var(--primary);font-size: 30px;margin-left: 0px;"></i></button></div>';
            } else {
                this.pause();
                this.UI.play.innerHTML = '<div class="col fs-4 text-center align-self-center" id="play"><button class="btn btn-link btn-circle" style="border-radius: 50px;background: var(--secondary );border: .1px solid var(--primary);" type="button"><i class="fa fa-play" style="color: var(--primary);font-size: 30px;margin-left: 6px;"></i></button></div>';
            }
        })

        this.UI.loop.addEventListener('click', () => {
            if (this.islooping) {
                this.UI.loop.innerHTML = '<i class="fa fa-repeat fs-4 text-end"></i> Loop off';
                this.islooping = false;
            } else {
                this.UI.loop.innerHTML = '<i class="fa fa-repeat fs-4 text-end"></i> Looping!';
                this.islooping = true;
            }
        })

        this.UI.progressBar.addEventListener('change', (e) => {
            const percentage = e.target.value;
            const totalTime = this.audio.duration;
            const currentTime = (percentage / 100) * totalTime;
            this.audio.currentTime = currentTime;
        })

        this.cache = {
            last: {
                index: null,
                blobUrl: null
            },
            current: {
                index: 0,
                blobUrl: null
            },
            next: {
                index: null,
                blobUrl: null
            }
        }

        parent.appendChild(this.audio);


    }

    initialLoad() {
        

        this.currentId = getQueryVariable('id');
        // get recommendations from the api
        fetch(`${this.baseurl}recommendations?video_id=${this.currentId}`)
            .then(response => response.json())
            .then(data => {
                this.recom = data;
                this.cache.current.index = 0;
                this.loadRecommendationsIntoUI();
                this.downloadIndex(this.cache.current.index, (blobUrl) => {
                    this.cache.current.blobUrl = blobUrl;
                    this.audio.src = this.cache.current.blobUrl;
                    this.UI.download.href = this.cache.current.blobUrl;
                    this.UI.download.classList.remove('disabled');
                    this.audio.load();
                    console.log(this.recom[this.cache.current.index].title);
                    this.updateUI(this.recom[this.cache.current.index]);
                });
                this.cache.next.index = 1;
                this.downloadIndex(this.cache.next.index, (blobUrl) => {
                    this.cache.next.blobUrl = blobUrl;
                })
            })
    }

    downloadIndex(index, cb) {
        fetch(`${this.baseurl}download?video_id=${this.recom[index].id}`)
            .then(response => response.blob())
            .then(blob => {
                cb(window.URL.createObjectURL(blob));
            })
    }


    getAudioElement() {
        this.audio = document.createElement('audio');
        this.audio.setAttribute('controls', 'controls');
        this.audio.autoplay = true;
        
        this.audio.addEventListener('pause', () => {
            this.ispaused = true;
            this.pause();
        })

        this.audio.addEventListener('play', () => {
            this.ispaused = false;
            this.play();
        })

        this.audio.addEventListener('ended', () => {
            this.handleEnd();
        })

        this.audio.addEventListener('playing', () => {
            this.ispaused = false;
            this.UI.play.innerHTML = '<div class="col fs-4 text-center align-self-center" id="play"><button class="btn btn-link btn-circle" style="border-radius: 50px;background: var(--secondary );border: .1px solid var(--primary);" type="button"><i class="fa fa-pause" style="color: var(--primary);font-size: 30px;margin-left: 0px;"></i></button></div>';
        })

        function secondsToSplitString(seconds) {
            let minutes = Math.floor(seconds / 60);
            let secondsLeft = seconds % 60;
            secondsLeft = Math.round(secondsLeft)
            secondsLeft = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
            return `${minutes}:${secondsLeft}`
        }

        this.audio.addEventListener('timeupdate', () => {
            const currentTime = this.audio.currentTime;
            const totalTime = this.audio.duration;
            const percentage = Math.ceil((currentTime / totalTime) * 100);
            this.UI.progressBar.value = percentage;
            if (this.UI.currentTime !== secondsToSplitString(currentTime)) {
                this.UI.currentTime.innerHTML = secondsToSplitString(currentTime);
            }
        })
    }


    pause() {
        this.audio.pause();
        this.ispaused = true;
    }

    play() {
        this.audio.play();
        this.ispaused = false;
    }
    
    setVolume(volume) {
        this.audio.volume = volume;
    }

    handleEnd() {
        if (this.islooping) {
            this.audio.src = this.cache.current.blobUrl;
            this.UI.download.href = this.cache.current.blobUrl;
            this.audio.load();
            return
        } 

        if (this.cache.last.blobUrl) {
            URL.revokeObjectURL(this.cache.last.blobUrl);
        }

        this.cache.last = this.cache.current;
        this.cache.current = this.cache.next;
        this.cache.next = {
            index: this.cache.current.index + 1,
            blobUrl: null
        }
        
        if (!this.cache.current.blobUrl) {
            this.downloadIndex(this.cache.current.index, (blobUrl) => {
                this.cache.current.blobUrl = blobUrl;
                this.audio.src = this.cache.current.blobUrl;
                this.UI.download.href = this.cache.current.blobUrl;
                this.audio.load();
            })
        } else {
            this.audio.src = this.cache.current.blobUrl;
            this.UI.download.href = this.cache.current.blobUrl;
            this.audio.load();
        }
        this.updateUI(this.recom[this.cache.current.index]);
        window.history.pushState("", "", `?id=${this.recom[this.cache.current.index].id}`);
        this.cacheLastPlayed(this.recom[this.cache.current.index]);

        this.downloadIndex(this.cache.next.index, (blobUrl) => {
            this.cache.next.blobUrl = blobUrl;  
        })

    }

    handleNext() {
        this.islooping = false;
        this.UI.loop.innerHTML = '<i class="fa fa-repeat fs-4 text-end"></i> Loop off';
        this.handleEnd();
    }

    handlePrev() {
        if (this.cache.next.blobUrl) {
            URL.revokeObjectURL(this.cache.next.blobUrl);
        }

        this.cache.next = this.cache.current;
        this.cache.current = this.cache.last;
        
        if (this.cache.current.blobUrl) {
            this.audio.src = this.cache.current.blobUrl;
            this.UI.download.href = this.cache.current.blobUrl;
            this.audio.load();
        } else {
            this.downloadIndex(this.cache.current.index, (blobUrl) => {
                this.cache.current.blobUrl = blobUrl;
                this.audio.src = this.cache.current.blobUrl;
                this.UI.download.href = this.cache.current.blobUrl;
                this.audio.load();
            })
        }

        window.history.pushState("", "", `?id=${this.recom[this.cache.current.index].id}`);
        this.updateUI(this.recom[this.cache.current.index]);

        this.cache.last = {
            index: this.cache.current.index - 1,
            blobUrl: null
        }

        this.cacheLastPlayed(this.recom[this.cache.current.index]);

        this.downloadIndex(this.cache.last.index, (blobUrl) => {
            this.cache.last.blobUrl = blobUrl;
        })

    }

    handlePlayFromList(index) {
        if (this.cache.current.blobUrl) {
            URL.revokeObjectURL(this.cache.current.blobUrl);
        }
        if (this.cache.next.blobUrl) {
            URL.revokeObjectURL(this.cache.current.blobUrl);
        }

        this.cache.current = {
            index: index,
            blobUrl: null
        }
        this.cache.next = {
            index: index + 1,
            blobUrl: null
        }
        console.log([index, this.recom[index]])
        this.downloadIndex(this.cache.current.index, (blobUrl) => {
            this.cache.current.blobUrl = blobUrl;
            this.audio.src = this.cache.current.blobUrl;
            this.UI.download.href = this.cache.current.blobUrl;
            this.audio.load();
            this.updateUI(this.recom[index]);
        })
        window.history.pushState("", "", `?id=${this.recom[this.cache.current.index].id}`);
        this.cacheLastPlayed(this.recom[this.cache.current.index]);
        this.downloadIndex(this.cache.next.index, (blobUrl) => {
            this.cache.next.blobUrl = blobUrl;
        })
    }

    updateUI(songData) {
        this.UI.songTitle.innerHTML = songData.title;
        this.UI.songArtist.innerHTML = songData.artists.join(', ');
        this.UI.thumbnail.src = songData.thumbnail.large;
        this.UI.totalTime.innerHTML = songData.length
    }

    trimString(string) {
        if (string.length > 25) {
            return `${string.substring(0, 25)}...`
        } else {
            return string
        }
    }

    loadRecommendationsIntoUI() {
        this.recom.forEach((song, index) => {
            let li = document.createElement('li');
            li.innerHTML = `<div class="row" style="padding: 0px;border-color: var(--bs-body-color)">
                            <div class="col-auto"><img src="${song.thumbnail.mini}" width="60"></div>
                            <div class="col">
                                <div class="row">
                                    <div class="col-10" style="padding-right: 0;">
                                        <h5>${this.trimString(song.title)}</h5>
                                    </div>
                                    <div class="col-2 text-end align-self-center" style="padding: 0;"><i class="fa fa-play fs-4 text-start go"></i></div>
                                    <div class="col-10" style="padding-right: 0;">
                                        <p style="font-size: 13px;">${this.trimString(song.artists.join(', '))}</p>
                                    </div>
                                    <div class="col-2" style="padding: 0;">
                                        <p class="text-end" style="padding: 0;">${song.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            li.classList.add('recommendation');
            li.addEventListener('click', () => {
                this.handlePlayFromList(index);
            })
            this.UI.recommendations.appendChild(li);
        })
 
    }

    cacheLastPlayed(songData) {
        localStorage.lastSong = JSON.stringify(songData);
    }

}