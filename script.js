/*Selecting elements  */
const video=document.querySelector('video');
const playButton=document.querySelector('button');
const track=document.querySelector('.progress');
const volume=document.getElementById('volume');
const backButton=document.getElementById('back');
const forwardButton=document.getElementById('forward');
const volumeIcon=document.querySelector('.fa-volume-up');
const time=document.getElementById('time');

/*Initializing variables */
let isPlaying=false;
let ismousedown=false;
let length;
function runafterload(){
    length=video.duration;//if we run this before even metadata is loaded then length gives NaN!
    track.max=length;
    volume.value=video.volume;
    const min=Math.floor(length/60);
    const sec=Math.floor(length%60);
    time.innerHTML=`00:00 / ${min}:${sec}`;
    console.log(min,sec);
}
//Resource- https://www.w3schools.com/tags/av_event_loadeddata.asp
video.addEventListener('loadedmetadata', runafterload);
function togglePlay(){
    if(isPlaying==false){
        playButton.innerHTML="&#10074;&#10074;";
        video.play();
    }
    else{
        playButton.innerHTML="&#9658;";
        video.pause();
    }
    isPlaying=!isPlaying;
}

playButton.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
window.addEventListener('keypress',(e)=>{
    //console.log(e);
    if(e.code==='Space'){
        togglePlay();
    }
}) 
video.addEventListener('timeupdate',function(){
    // console.log(video.currentTime);
    //document.getElementById('track').value=video.currentTime;
    /*Update time*/
    let currmin=Math.floor(video.currentTime/60);
    currmin=currmin<10?currmin="0"+currmin:currmin=currmin;//remember adding number with string!
    let currsec=(Math.floor(video.currentTime%60));
    currsec=currsec<10?currsec="0"+currsec:currsec=currsec;

    let min=Math.floor(length/60);
    let sec=Math.floor(length%60);
    time.innerHTML=`${currmin}:${currsec} / ${min}:${sec}`;

    /*Updating the seek-track  */
    const percentFilled= (100/length)*video.currentTime;
   // console.log(percentFilled);
    document.querySelector('.progress__filled').style.flexBasis=percentFilled+"%";
})
video.addEventListener('ended',function(){

    isPlaying=false;
})
/*Seek track  */
function scrub(e){
    //ismousedown=true;
    const percent= (e.offsetX/track.offsetWidth)*100;
    video.currentTime=(length/100)*(percent);
}
track.addEventListener('click',scrub);
track.addEventListener('mousemove',function(e){
    if(ismousedown){
        scrub(e);
    }
});
track.addEventListener('mousedown',()=>{ismousedown=true});
track.addEventListener('mousedown',()=>{ismousedown=false});

volume.addEventListener('input',function(){
    video.volume=(document.getElementById('volume').value)/10;
    console.log(video.volume);
})
backButton.addEventListener('click',function(){
    video.currentTime=Math.max(0,video.currentTime-10);
})
forwardButton.addEventListener('click',function(){
    video.currentTime=Math.min(length,video.currentTime+20);

})


volumeIcon.addEventListener('mouseover',()=>{
    volume.style.opacity=1;
});

volume.addEventListener('mouseleave',()=>{
    volume.style.opacity=0;
})