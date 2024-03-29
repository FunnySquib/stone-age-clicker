function Sound() {


    this.muted = false;

    this.assets = {};


    this.play = function(name, attributes) { // attributes example: { volume : 100, onfinish : foo(), loops : 3 }
        if(this.assets.hasOwnProperty(name)) {
            soundManager.play(name + "_instance_" + this.assets[name].position, attributes);
            this.assets[name].position++;
            if(this.assets[name].position >= this.assets[name].count) {
                this.assets[name].position = 0;
            }
        }
    };


    this.muteUnmute = function() {
        this.muted = !this.muted;
        if(this.muted) {
            soundManager.mute();
        } else {
            soundManager.unmute();
        }
    };

}