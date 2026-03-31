// console.log('Let\'s write JavaScript');
//  let currentSong=new Audio();
// async function getSongs() {
//     let a = await fetch("http://127.0.0.1:5500/songs/");
//     let response = await a.text();

//     let div = document.createElement("div");
//     div.innerHTML = response; // ✅ fixed typo

//     let as = div.getElementsByTagName("a");
//     let songs = [];

//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split("/songs/")[1])
//         }
//     }

//     return songs;
// }
// const playMusic = (track)=>{
//   //let audio= new Audio("/songs/" +track)
//   currentSong.src="/songs/" +track;
// currentSong.play();
//  // audio.play()
// }

// async function main() {
//     let songs = await getSongs();
//     console.log(songs);

//     // if (songs.length > 0) {
//     //     let audio = new Audio(songs[0]);
//     //     audio.play();
//     // } else {
//     //     console.log("No songs found!");
//     // }
//     // play the first song
//     //show all the song in plat list
//    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
//    for(const song of songs){
//     songUL.innerHTML=songUL.innerHTML + `<li>
//     <img class="invert" src="music.svg ">
//                   <div class="info">
//                     <div> ${song.replaceAll("%20","")}</div>
//                     <div>Hina</div>
//                   </div>
//                 <div class="playnow">
//                 <span>Play Now</span>
//               <img class ="invert" src="play.svg" >
//             </div>
//      </li>`;
//    }
//  /*let audio = new Audio(songs[0]);
// // audio.play();
//  audio.addEventListener("loadeddata",()=>{
//     let duration=audio.duration;
//     console.log(audio.duration,audio.currentSrc,audio.currentTime)
//     // the duration variable now holds the duration (in seconds)of the audio clip
//  })*/
// //attach event listener to each song
// Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
//   e.addEventListener("click",element=>{
//     playMusic(e.querySelector(".info").firstElementChild.innerHTML)
//       console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
//   })
// })
// }

// main();*/
console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;
let songsData = {};

async function loadSongsData() {
  let a = await fetch('/songs.json');
  songsData = await a.json();
}
async function getSongs(folder) {
  currFolder = folder;
  let folderKey = folder.split('/').pop();
  songs = songsData[folderKey] || [];
  
  // Show all the songs in playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
            <li>
                <img class="invert" src="music.svg">
                <div class="info">
                    <div data-filename="${song}">${decodeURIComponent(
      song
    )}</div>
                    <div>Hina</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="play.svg">
                </div>
            </li>`;
            
  }

  // Attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      let filename =
        e.querySelector(".info").firstElementChild.dataset.filename;
      playMusic(filename);
      
    });
  });
   return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong
      .play()
      .then(() => {
        console.log("Playing:", track);
      })
      .catch((err) => {
        console.error("Playback error:", err);
      });
  }

  currentSong.addEventListener("error", (e) => {
    console.error("Audio playback error:", e);
  });
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// async function displayAlbums(){
//    let a = await fetch(`http://127.0.0.1:5500/songs/`);
//   let response = await a.text();

//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors=div.getElementsByTagName("a")
//   Array.from(anchors).forEach(async e=>{
//     if(e.href.includes("/songs")){
//       // console.log(e.href.split("/").slice(-2)[0])
//          let folder=e.href.split("/").slice(-2)[0]
//          //get the metadata of folder
//           let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//   let response = await a.json();
//   console.log(response)

//     }
//   })
// }
async function displayAlbums() {
  let cardContainer = document.querySelector(".cardContainer");
  let folders = Object.keys(songsData);

  folders.forEach(async (folder) => {
      let a = await fetch(`/songs/${folder}/info.json`);

      if (a.ok) {
        let response = await a.json();
        console.log(response);
        cardContainer.innerHTML =
          cardContainer.innerHTML +
          `<div data-folder="${folder}" class="card">
<div class="play">
   
  <svg width="24" height="24" viewBox="0 0 24 24" style="fill: black;">
    <path d="M7 6v12l10-6z"></path>
  </svg>


</div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p></div>`;
        //load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach((e) => {
          // Remove old listeners to prevent duplicates (rudimentary approach)
          let new_element = e.cloneNode(true);
          e.parentNode.replaceChild(new_element, e);
          new_element.addEventListener("click", async (items) => {
            console.log(items, items.currentTarget.dataset);
            songs = await getSongs(
              `songs/${items.currentTarget.dataset.folder}`
            );
            if(songs && songs.length > 0) {
              playMusic(songs[0]);
              play.src = "pause.svg";
            }
          });
        });
      }
  });
}

async function main() {
  await loadSongsData();
  await getSongs("songs/ncs");
  //console.log(songs);
  if(songs && songs.length > 0) {
    playMusic(songs[0], true);
  }
  //display all albums on the page
  displayAlbums();
  // // Show all the songs in playlist
  // let songUL = document
  //   .querySelector(".songList")
  //   .getElementsByTagName("ul")[0];

  // for (const song of songs) {
  //   songUL.innerHTML += `
  //           <li>
  //               <img class="invert" src="music.svg">
  //               <div class="info">
  //                   <div data-filename="${song}">${decodeURIComponent(
  //     song
  //   )}</div>
  //                   <div>Hina</div>
  //               </div>
  //               <div class="playnow">
  //                   <span>Play Now</span>
  //                   <img class="invert" src="play.svg">
  //               </div>
  //           </li>`;
  // }

  // // Attach event listener to each song
  // Array.from(
  //   document.querySelector(".songList").getElementsByTagName("li")
  // ).forEach((e) => {
  //   e.addEventListener("click", (element) => {
  //     let filename =
  //       e.querySelector(".info").firstElementChild.dataset.filename;
  //     playMusic(filename);
  //   });
  // });
  //attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  //listener for time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `
    ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });
  // add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  // add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  //add an event listener to previous
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  //add an event listener to next
  next.addEventListener("click", () => {
    console.log("next clicked");
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  //add event listener to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      //console.log(e,e.target,e.target.value)
      console.log("setting volume to", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
      if(currentSong.volume>0){
        document.querySelector(".volume>img").src=   document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
      }
    });
    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
      console.log(e.target)
      if(e.target.src.includes("volume.svg")){
       e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0
         document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=0;
      }
      else{
        e.target.src=  e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=.10
             document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value=10;
      }
    })
}

main();
