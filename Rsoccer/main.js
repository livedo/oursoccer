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
    
    document.addEventListener('select', function() {
                              console.log("GOT SELECT");
                         launchPlayer();
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
    
    
    getDocument("https://www.reddit.com/r/soccer.json?limit=30", function(e) {
                response = e.target.response; // TODO: var
                var posts = response.data.children;
                console.log(posts);
                var post, i, fragment;
                for(i = 0; i < posts.length; i++) {
                    post = posts[i].data;
                    if (post.domain == "streamable.com") {
                        console.log("goat streamable");
                        fragment = parser.parseFromString(listItem(post), "application/xml");
                        frag = fragment.firstChild;
                        console.log("parsed fragment", fragment.firstChild);
                        // TODO: Why the dom exception?
                        //section.appendChild(fragment.firstChild);
                        section.innerHTML = section.innerHTML + listItem(post);
                        getVideo(post);
                    }
                
                }

    });
    
}

App.onExit = function() {
    console.log('App finished');
}

function getVideo(post) {
    if (post.domain == "streamable.com") {
        getStreamable(post);
    } else {
    }
    // if streamable
        // Get data from streamable API
    // else
        // try to upload to streamable
            // Get data from streamable API
}

function getStreamable(post) {
    
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


function baseTemplate() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <listTemplate>
            <list>
                <header>
                    <title>Our Soccer</title>
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
        img = post.secure_media.oembed.thumbnail;
    } catch(e) {
        img = {};
    }
    return `
    <listItemLockup id="${post.id}">
        <title>⌛ ${post.title}</title>
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


