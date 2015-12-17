console.log("WHAHAHAHAHAHAHHAHA");

function getDocument(url, fn) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "json";
    templateXHR.addEventListener("load", fn, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
    return templateXHR;
}


var response = {};

function pushDoc(document) {
    navigationDocument.pushDocument(document);
//    var button = document.getElementsByTagName("button")[0];
    
    document.addEventListener('select', function(e) {
                              evve = e;
                              getVideo(e.target.getAttribute("url"));
                              console.log("GOT SELECT", arguments);
                         //launchPlayer();
                         });
}

var dokki;

App.onLaunch = function(options) {
    console.log('TERPPA VAAN!');
//    var templateURL = 'http://localhost:8000/hello.tvml';
//    getDocument(templateURL, function() {pushDoc(templateXHR.responseXML)});
    var resource = baseTemplate();
    var parser = new DOMParser();
    var doc = parser.parseFromString(resource, "application/xml");

    // TODO: parsi section
    console.log(doc);
    dokki = doc;
    acDoc = getActiveDocument();
    var section = doc.getElementsByTagName('section').item(0);
    console.log("seksön", section);
    pushDoc(doc);
    
    
    getDocument("https://www.reddit.com/r/soccer.json?limit=100", function(e) {
                var response = e.target.response;
                var posts = response.data.children;
                console.log(posts);
                var post, i, fragment;
                for(i = 0; i < posts.length; i++) {
                    post = posts[i].data;
                    if (post.domain == "streamable.com") {
                //(post.media && post.media.oembed && post.media.oembed.type == "video") {
                        console.log("goat streamable");
                        fragment = parser.parseFromString(listItem(post), "application/xml");
                        frag = fragment.firstChild;
                        console.log("parsed fragment", fragment.firstChild);
                        // TODO: Why the dom exception?
                        //section.appendChild(fragment.firstChild);
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
    // if streamable
        // Get data from streamable API
    // else
        // try to upload to streamable
            // Get data from streamable API
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
                console.log(response);
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
        console.log("tryin");
        img = post.media.oembed;
    } catch(e) {
        console.log("phail");
        img = {};
    }
    console.log(img);
    return `
    <listItemLockup id="${post.id}" url="${post.url}">
        <title>${post.title}</title>
        <relatedContent>
            <lockup>
                <img src="${img.thumbnail_url}" width="${img.thumbnail_width}" height="${img.thumbnail_height}" />
                <title>Video (${post.domain})</title>
                <description>${post.title}</description>
            </lockup>
        </relatedContent>
    </listItemLockup>
`;
}


