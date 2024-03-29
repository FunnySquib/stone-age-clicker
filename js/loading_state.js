function LoadingState() {

    this.SOUND_MANAGER_PERCENTAGE = 5;
    this.IMAGE_PERCENTAGE = 30;
    this.SOUND_PERCENTAGE = 10;
    this.PIXEL_FONT_PERCENTAGE = 5;
    this.WEB_FONT_PERCENTAGE = 10;
    this.FAKE_PERCENTAGE = 40;

    this.FAKE_LOADING_TIME = 3.0; // adjust fixed loading time

    this.TIME_BEFORE_SOUND_LOADING_FAIL = 5.0;

    this.percentage = 0;
    this.fakeLoadingCountdown = 0.0;
    this.soundLoadingCountdown = 0.0;


    this.init = function() {

        this.fakeLoadingCountdown = this.FAKE_LOADING_TIME;
        this.soundLoadingCountdown = this.TIME_BEFORE_SOUND_LOADING_FAIL;

        preloadingManager.preload();
    };


    this.hide = function() {
        jQuery("#loading").hide();
    };


    this.update = function() {

        var soundManagerPreloader = preloadingManager.soundManagerPreloader;
        var imagePreloader = preloadingManager.imagePreloader;
        var soundPreloader = preloadingManager.soundPreloader;
        var pixelFontPreloader = preloadingManager.pixelFontPreloader;
        var webFontPreloader = preloadingManager.webFontPreloader;

        var soundManagerPercentage = soundManagerPreloader.getFractionLoaded() * this.SOUND_MANAGER_PERCENTAGE;
        var imagePercentage = imagePreloader.getFractionLoaded() * this.IMAGE_PERCENTAGE;
        var soundPercentage = soundPreloader.getFractionLoaded() * this.SOUND_PERCENTAGE;
        var pixelFontPercentage = pixelFontPreloader.getFractionLoaded() * this.PIXEL_FONT_PERCENTAGE;
        var webFontPercentage = webFontPreloader.getFractionLoaded() * this.WEB_FONT_PERCENTAGE;
        var fakeLoadingPercentage = (1.0 - (this.fakeLoadingCountdown / this.FAKE_LOADING_TIME)) * this.FAKE_PERCENTAGE;

        this.percentage = soundManagerPercentage + imagePercentage + soundPercentage + pixelFontPercentage + webFontPercentage + fakeLoadingPercentage;

        if(imagePreloader.isLoaded() && pixelFontPreloader.isLoaded() && webFontPreloader.isLoaded() &&
            ((soundManagerPreloader.isLoaded() && soundPreloader.isLoaded()) || this.soundLoadingCountdown < 0)) {
            this.fakeLoadingCountdown -= timer.delta;
            if(this.fakeLoadingCountdown < 0) {
                CustomPreloading.preload();
                game.setState("menu");
            }
        }

        if(imagePreloader.isLoaded() && pixelFontPreloader.isLoaded() && webFontPreloader.isLoaded() && !soundPreloader.isLoaded()) {
            this.soundLoadingCountdown -= timer.delta;
        }
    };


    this.draw = function() {

        var g = c.createLinearGradient(0, 0, 0, game.height);
        g.addColorStop(0, "#ccc");
        g.addColorStop(1, "#eee");

        c.fillStyle = g;
        c.fillRect(0, 0, game.width, game.height);

        var loadingY = Math.round(game.centerY + 47 + (0.5 * (game.centerY - 50)));

        c.fillStyle = "#aaa";
        c.fillRect(game.centerX - 80, loadingY, 160, 6);

        c.fillStyle = "#333";
        c.fillRect(game.centerX - 80, loadingY, 1.6 * this.percentage, 6);
    };

}