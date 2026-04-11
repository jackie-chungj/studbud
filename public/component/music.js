// Image used dowloaded from - https://i.scdn.co/image/ab67616d0000b273550b17c7a9cf638c9514f30d
// music-1 from - https://www.youtube.com/watch?v=palWMnxi4GU&list=RDjsWSx9eC31w&index=16&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// music-2 from - https://www.youtube.com/watch?v=jsWSx9eC31w&list=RDjsWSx9eC31w&index=1&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// music-3 from - https://www.youtube.com/watch?v=S4UQP600LyI&list=RDjsWSx9eC31w&index=10&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// music-4 from - https://www.youtube.com/watch?v=xJ3xwwLgcAU&list=RDjsWSx9eC31w&index=3&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// music-5 from - https://www.youtube.com/watch?v=MTW4CKVTZdA&list=RDjsWSx9eC31w&index=15&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// music-6 from - https://www.youtube.com/watch?v=NtK_ZsYVqgY&list=RDjsWSx9eC31w&index=12&ab_channel=CafeMusicBGMchannelCafeMusicBGMchannelOfficialArtistChannel
// downloaded youtube and convert to mp3 using - https://yt1s.com/en6

// I translated the song names to english
// The music player doesnt work on npm run dev - with error message "Uncaught (in promise) DOMException: The element has no supported sources."
// I know it works becuase i made the music player first in another vscode and it worked perfectly fine when I click go live without npm run dev. 
// But when I paste the code into the studbud file and ran the code with npm run dev it doesnt work :(
  // if you know the reason why can you please leave feedback or comment on why and how to make it work, because I want to put it in my portfolio so I want to make it work in the future :) thanks 
let allMusic = [
  {
    name: "A Town with an ocean View (Jazz Ver)",
    artist: "Cafe Music BGM Channel ",
    img: "music-1",
    src: "music-1"
  },
  {
    name: "Laputa (BossaNova ver)",
    artist: "Cafe Music BGM Channel",
    img: "music-2",
    src: "music-2"
  },
  {
    name: "Merry-Go-Round Of Life (Jazz Version)",
    artist: "Cafe Music BGM Channel",
    img: "music-3",
    src: "music-3"
  },
  {
    name: "My Neighbor Totoro (BossaNova ver)",
    artist: "Cafe Music BGM Channel",
    img: "music-4",
    src: "music-4"
  },
  {
    name: "Mother (BossaNova Ver)",
    artist: "Cafe Music BGM Channel",
    img: "music-5",
    src: "music-5"
  },
  {
    name: "Stroll (BossaNova Ver)",
    artist: "Cafe Music BGM Channel",
    img: "music-6",
    src: "music-6"
  },
];

// Reference and learnt from - https://dev.to/codingnepal/create-custom-music-player-in-javascript-2367

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#music-list-close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
let isMusicPaused = true;

window.addEventListener("load", ()=>{
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb){
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `assets/images/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `assets/songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic(){
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//pause music function
function pauseMusic(){
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

//prev music function
function prevMusic(){
  musicIndex--; //decrement of musicIndex by 1
  //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

//next music function
function nextMusic(){
  musicIndex++; //increment of musicIndex by 1
  //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

// play or pause button event
playPauseBtn.addEventListener("click", ()=>{
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

//prev music button event
prevBtn.addEventListener("click", ()=>{
  prevMusic();
});

//next music button event
nextBtn.addEventListener("click", ()=>{
  nextMusic();
});

// update song total duration once when audio data is loaded
const musicDuartion = wrapper.querySelector(".max-duration");
mainAudio.addEventListener("loadeddata", ()=>{
  let mainAdDuration = mainAudio.duration;
  let totalMin = Math.floor(mainAdDuration / 60);
  let totalSec = Math.floor(mainAdDuration % 60);
  if(totalSec < 10){
    totalSec = `0${totalSec}`;
  }
  musicDuartion.innerText = `${totalMin}:${totalSec}`;
});

// update progress bar width according to music current time
const musicCurrentTime = wrapper.querySelector(".current-time");
mainAudio.addEventListener("timeupdate", (e)=>{
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if(currentSec < 10){
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e)=>{
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration
  
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic(); //calling playMusic function
  playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//code for what to do after song ended
mainAudio.addEventListener("ended", ()=>{
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText){
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

//show music list onclick of music icon
moreMusicBtn.addEventListener("click", ()=>{
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="music-list-row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="assets/songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//play particular song from the list onclick of li tag
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}