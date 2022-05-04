export class KeyBindHandler {
    constructor(player) {
        this.player = player;
        this.keybinds = {};
        document.addEventListener("keydown", (e) => {
            this.keybinds[e.key] = true;
            this.handleEvent(e);
        });
        document.addEventListener("keyup", (e) => {
            this.keybinds[e.key] = false;
        });
    }

    handleEvent(e) {
        if (this.keybinds[" "]) {
            e.preventDefault();
            this.player.resume();
        } else if (this.keybinds["l"]) {
            this.player.islooping = !this.player.islooping;
        } else if (this.keybinds["Alt"]) {
            if (this.keybinds["ArrowUp"]) {
                // TODO: display current volume
                // TODO: make clicky sounds when changing volume
                this.player.setVolume(this.player.audio.volume + 0.1);
            } else if (this.keybinds["ArrowDown"]) {
                this.player.setVolume(this.player.audio.volume - 0.1);
            } else if (this.keybinds["ArrowLeft"]) {
                this.player.audio.currentTime -= 5;
            } else if (this.keybinds["ArrowRight"]) {
                this.player.audio.currentTime += 5;
            }
        }
    }
}
