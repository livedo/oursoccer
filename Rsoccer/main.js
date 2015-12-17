function getDocument(url, fn) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "json";
    templateXHR.addEventListener("load", fn, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
    return templateXHR;
}


function pushDoc(document) {
    navigationDocument.pushDocument(document);
    document.addEventListener('select', function(e) {
                              getVideo(e.target.getAttribute("url"));
                         });
}


App.onLaunch = function(options) {
    var resource = baseTemplate();
    var parser = new DOMParser();
    var doc = parser.parseFromString(resource, "application/xml");

    var section = doc.getElementsByTagName('section').item(0);
    pushDoc(doc);
    
    
    getDocument("https://www.reddit.com/r/soccer.json?limit=100", function(e) {
                var response = e.target.response;
                var posts = response.data.children;
                var post, i, fragment;
                for(i = 0; i < posts.length; i++) {
                    post = posts[i].data;
                    if (post.domain == "streamable.com") {
                //(post.media && post.media.oembed && post.media.oembed.type == "video") {
                        section.innerHTML = section.innerHTML + listItem(post);
                    }
                
                }

    });
    
}

App.onExit = function() {
    console.log('App finished');
}

function getVideo(url) {
    var matches;
    if (matches = url.match(/^https\:\/\/streamable\.com\/(\w+)/)) {
        console.log("got streamable id", matches[1]);
        getStreamable(matches[1]);
    } else {
        console.log("NO MATCH!!!");
        importAndPlay(url)
    }
}

function importAndPlay(url) {
    getDocument("https://api.streamable.com/import?url=" + encodeURI(url), function(e) {
                var response = e.target.response;
                console.log("IMPORTED!!!", response);
                getStreamable(response.shortcode);
                });
}


function getStreamable(id) {
    console.log("getting streamable id", id);
    getDocument("https://api.streamable.com/videos/" + id, function(e) {
                var response = e.target.response;
                launchPlayer("http:" + response.files.mp4.url);
                });
}

function launchPlayer(url) {
    console.log("Now playing", url);
    var player = new Player();
    var playlist = new Playlist();
    var mediaItem = new MediaItem("video", url);
    player.playlist = playlist;
    player.playlist.push(mediaItem);
    player.present();
    player.play()
}


function baseTemplate() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <listTemplate>
            <list>
                <header>
                    <title>Hot videos on r/soccer</title>
                </header>
                <section id="main">
                </section>
            </list>
        </listTemplate>
    </document>
`;

}

function listItem(post) {
    var img;
    try {
        img = post.media.oembed;
    } catch(e) {
        img = {};
    }
    return `
    <listItemLockup id="${post.id}" url="${post.url}">
        <title>${post.title}</title>
        <relatedContent>
            <lockup>
                <img src="${img.thumbnail_url}" width="${img.thumbnail_width}" height="${img.thumbnail_height}" />
                <title>Video</title>
                <description>${post.title}</description>
            </lockup>
        </relatedContent>
    </listItemLockup>
`;
}


