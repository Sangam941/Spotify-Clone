console.log("let's start javascript......");

let currentsong = new Audio();
let songs;
let currFolder;
let songlist = document.querySelector(".songlist ul");

// function to change seconds into minuete:seconds formate 
function formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60); // Gets whole minutes
    const remainingSeconds = Math.floor(seconds % 60);   // Gets whole remaining seconds

    // Pad with leading zero if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSong(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5502/${folder}/`);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    
    let as = div.getElementsByTagName("a");
    // console.log(as)

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs)

    // songlist = document.querySelector(".songlist ul");
    songlist.innerHTML = "";
    for (const song of songs) {

        let songdetail = `${song.replaceAll("%20", " ").replaceAll("%2", " ").split("17")[0].replaceAll("_", ".mp3")}`;
        // console.log(songdetail)
        let songname = songdetail.split("-")[1];
        let songartist = songdetail.split("-")[0];

        // adding songs in playlist
        songlist.innerHTML = songlist.innerHTML +
            `<li>
                            <div class="album">
                                <div class="musicdetail">
                                    <div class="music">
                                        <img src="svg/music.svg" alt="">
                                    </div>
                                    <div class="details">
                                        <p class="playthissong">${song}</p>
                                        <p class="sname">${songname}</p>
                                        <p>-${songartist}</p>
                                    </div>
                                </div>

                                <div class="playnow">
                                    <p>Play Now</p>
                                    <div class="play">
                                        <img src="svg/play.svg" alt="">
                                    </div>
                                </div>
                            </div>

         </li>`;
    }


    // click the song whichever you want to play
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            // console.log(e.querySelector(".details .playthissong").innerHTML);
            // playmusic(e.querySelector(".details .playthissong").innerHTML, e.querySelector(".details .sname").innerHTML);
            playmusic(e.querySelector(".details .playthissong").innerHTML);
            // currentsong.play();
            img.src = "svg/pause.svg";
        })

    })

    // let audio = new Audio(songs[0]);
    // audio.play();

    // to play and pause the current song 
    let play = document.getElementById("play");
    let img = document.querySelector("#play img");
    let pause = document.getElementById("pause");
    let previous = document.getElementById("previous");
    let next = document.getElementById("next");



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            img.src = "svg/pause.svg"
        } else {
            currentsong.pause();
            img.src = "svg/play.svg";
        }
    })

    // add event listener to previous and next button
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split(`/${folder}/`)[1])
        // console.log(currentsong.src.split(`/${folder}/`)[1])
        // console.log(index)
        // console.log(currentsong.src.split("/music/")[1])   
        if(index>0){
            playmusic(songs[index-1])
        }else{
            playmusic(songs[0])
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split(`/${folder}/`)[1])
        // console.log(index)

        if(index<songs.length-1){
            playmusic(songs[index+1])
        }else{
            playmusic(songs[index])
        }
        
    })

    //add event listener to the volume seekbar or range
    let range = document.getElementById("range");
    let volimg = document.querySelector(".volume img");
    let savevolume;

    range.addEventListener("change",(e)=>{
        // console.log(e.target.value);
        currentsong.volume = e.target.value / 100;
        savevolume = currentsong.volume;
        
        // console.log(currentsong.volume)
    })

    let ismute = false;

    volimg.addEventListener("click",(e)=>{
        if(ismute){
            volimg.src = "svg/volume.svg";
            currentsong.volume = savevolume;
            // console.log(currentsong.volume)
            range.value = currentsong.volume * 100;
            // console.log(range.value)
        }else{
            volimg.src = "svg/mute.svg";
            currentsong.volume = 0;
            range.value = 0;
        }
        ismute = !ismute;
        
    })

    
}

let playmusic = (gana) => {

    currentsong.src = `/${currFolder}/` + gana;
    // currentsong.load();
    // let audio = new Audio("/music/" + gana);
    console.log(gana)
    // currentsong.src = `/${currFolder}/` + gana;

    currentsong.play();
    // console.log(currentsong.src.split("/music/")[1])
    //  let songinfo = document.getElementById("songinfo").innerHTML = `<marquee>${sname}</marquee>`;

    // to decode the song from %20 to simple name.
    let songinfo = document.getElementById("songinfo").innerHTML = `<marquee>${decodeURI(gana)}</marquee>`;

    currentsong.addEventListener("timeupdate", (e) => {
        //  console.log(currentsong.currentTime, currentsong.duration)

        let songduration = document.getElementById("songduration").innerHTML = `${formatSeconds(currentsong.currentTime)} / ${formatSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    // add event listner to the seekbar.
    let seekbar = document.querySelector(".seekbar");

    seekbar.addEventListener("click", e => {

        // get the seekbar width and offsetX to calculate into percentage of length
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(e.target.getBoundingClientRect().width, e.offsetX)
        // console.log(percent)

        // move the circle along with the percent
        document.querySelector(".circle").style.left = percent + "%";

        // modify the currenttime of song with this formula
        currentsong.currentTime = (currentsong.duration * percent) / 100;
        // console.log(currentsong.currentTime)


    })

}

// add event listner to hamburger
let logo = document.querySelector(".logo").firstElementChild;

logo.addEventListener("click", (e) => {
    if (logo.src.endsWith("hamburger.svg")) {
        document.querySelector(".left").style.left = 0 + "%";
        logo.src = "svg/cross.svg";
    } else {
        document.querySelector(".left").style.left = -110 + "%";
        logo.src = "svg/hamburger.svg";

    }

})

// async function main() {
//     // await getSong("music/a_music");
//     // Load the library music whenever it is clicked
//     Array.from(document.querySelectorAll(".card")).forEach(e=>{
//         e.addEventListener("click",async item=>{
//             await getSong(`music/${item.currentTarget.dataset.folder}`);
//             // console.log(item.currentTarget.dataset.folder)
//         })
//     })
// }
async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:5502/music/`);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div)
    let anchors = div.getElementsByTagName("a");
    // console.log(anchors)
    let cardContainer = document.querySelector(".cardContainer");

    let array = (Array.from(anchors))
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("_")){
            // console.log(e.href)
            // console.log(e.href.split("/").slice(-1)[0])
            let folders = e.href.split("/").slice(-1)[0];
            let a = await fetch(`http://127.0.0.1:5502/music/${folders}/info.json`);
            let response = await a.json();
            // console.log(response);

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folders}" class="card">
                        <div>
                            <img src="/music/${folders}/cover.jpeg" alt="">
                          
                            <p>${response.description}</p>
                        </div>
                        <img class="pupobPlay" src="svg/pupobPlay.svg" alt="" height="60px">
                    </div>`
                } 
                // console.log(cardContainer)

    }
    
    // Load the library music whenever it is clicked
    Array.from(document.querySelectorAll(".card")).forEach(e=>{
       e.addEventListener("click",async item=>{
           console.log(item.currentTarget.dataset.folder)
           await getSong(`music/${item.currentTarget.dataset.folder}`);
           console.log(currFolder)
           playmusic(songs[0])
        })


   })

}

async function main() {

    // await getSong("music/a_music");  
    await displayalbum();
    
    
}


main();