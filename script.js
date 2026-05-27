
console.log("finally write js");

let currentsong = new Audio();

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    
    // Calculate full minutes
    let min = Math.floor(seconds / 60);
    // Calculate remaining seconds
    let sec = Math.floor(seconds % 60);
    
    // Add a leading zero if the number is less than 10 (e.g., 9 becomes "09")
    let formattedMin = min < 10 ? "0" + min : min;
    let formattedSec = sec < 10 ? "0" + sec : sec;
    
    return `${formattedMin}:${formattedSec}`;
}

function Playmusic(trackname) {
    currentsong.src = "./song/" + trackname + ".mp3";
    currentsong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(trackname);
    // document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    play.src = "playbutton.svg"
}

async function getsongs() {
    let a = await fetch("./song/");
    let response = await a.text(); 
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i = 0; i<as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs
}
async function main() {
    let songs = await getsongs();
    console.log(songs);

    let play = document.getElementById("play");

    let songlistcontainer = document.querySelector(".songlist");

    for (const song of songs) { 
        // for file name
        let filename = song.split("/song/")[1].replaceAll(".mp3", "") 

        // for display name 
        let songname = song.split("/song/")[1].replaceAll("%20", " ").replaceAll(".mp3", "");
        songname = songname.split("%")[0];

        let songhtml = `<div class="songdetails" data-song = "${filename}">
                    <img src="musicicon.svg" alt="">
                    <div>${songname}</div>
                    <div> Deepraj </div>
                    <img src="Playbutton.svg" alt="">

                </div>`
    
    songlistcontainer.innerHTML = songlistcontainer.innerHTML + songhtml;
    }

    let allsongcards = document.querySelectorAll(".songdetails")

    for (const card of allsongcards) {
        card.addEventListener("click" ,() => {
            let tracktoplay = card.dataset.song;
            Playmusic(tracktoplay);
        });
       
    }
    
    play.addEventListener("click", () => {
        if(currentsong.paused) {
            currentsong.play();
            play.src = "playbutton.svg"
            
        }
        else {
            currentsong.pause();
            play.src = "paused.svg"
        }
    })
    currentsong.addEventListener("timeupdate" , () => {
        let currenttime = formatTime(currentsong.currentTime);
        let duration = formatTime(currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${currenttime} / ${duration}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime)/(currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration)*percent/100;
    })

    document.querySelector(".menuicon").addEventListener("click", () => {
        let menu = document.querySelector(".menu");
        if(menu.src.includes("openmenu.svg")) {
             document.querySelector(".left").style.left = "0";
            document.querySelector(".menu").src = "closemenu.svg";
        }
        else {
            document.querySelector(".left").style.left = "-110%";
            document.querySelector(".menu").src = "openmenu.svg";
        }
       
    })

    let previous = document.getElementById("previous");
    let next = document.getElementById("next");

    previous.addEventListener("click", () => {
        let currentfilename = currentsong.src.split("/").slice(-1)[0];

        let index = songs.findIndex(song => song.endsWith(currentfilename));

        if(index-1 >= 0) {
            let tracktoplay = songs[index-1].split("/song/")[1].replaceAll(".mp3", "");
            Playmusic(tracktoplay);
        }

    });

    next.addEventListener("click", () => {
        let currentfilename = currentsong.src.split("/").slice(-1)[0];

        let index = songs.findIndex(song => song.endsWith(currentfilename));

        if(index+1 < songs.length) {
            let tracktoplay = songs[index+1].split("/song/")[1].replaceAll(".mp3", "");
            Playmusic(tracktoplay);
        }


    });

    let songcards = document.querySelectorAll(".songcard");

    for (const songcard of songcards) {
        songcard.addEventListener("click" , ()=> {
            let index = songcard.dataset.index;
            if(songs[index]) {
            let tracktoplay = songs[index].split("/song/")[1].replaceAll(".mp3", "");
            Playmusic(tracktoplay);
            }
            else {
                console.log("No song found ")
            }
        })
        
    }

     // playing the songs
    // var audio = new Audio(songs[9]);
    // audio.play();
}
 
 main();     
 