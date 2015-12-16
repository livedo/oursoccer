function getDocument(url) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "document";
    templateXHR.addEventListener("load", function() {pushDoc(templateXHR.responseXML);}, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
    return templateXHR;
}

function pushDoc(document) {
    navigationDocument.pushDocument(document);
    var button = document.getElementsByTagName("button")[0];
    
    document.addEventListener('select', function() {
                         launchPlayer();
                         });
}

App.onLaunch = function(options) {
    console.log('TERPPA VAAN!');
    var templateURL = 'http://localhost:8000/hello.tvml';
    getDocument(templateURL);
    
}

App.onExit = function() {
    console.log('App finished');
}



function launchPlayer() {
    var player = new Player();
    var playlist = new Playlist();
    var mediaItem = new MediaItem("video", "http://trailers.apple.com/movies/focus_features/9/9-clip_480p.mov");
    player.playlist = playlist;
    player.playlist.push(mediaItem);
    player.present();
    player.play()
}