/*Selecting elements  */
const playerControls=document.querySelector('.player-controls');
const video=document.querySelector('video');
const playButton=document.querySelector('button');
const track=document.querySelector('.progress');
const volume=document.getElementById('volume');
const backButton=document.getElementById('back');
const forwardButton=document.getElementById('forward');
const volumeIcon=document.querySelector('.fa-volume-up');
const time=document.getElementById('time');
const fullscreen=document.getElementById('fullscreen');
const fullwidth=document.getElementById('fullwidth');
const speedButton=document.getElementById('speed-button');
const speedBar=document.querySelector('.speed');
const nextVideo=document.getElementById('next-video');
const prevVideo=document.getElementById('prev-video');
const videoTitle=document.querySelector('.title');
const snap=document.getElementById('snap');
/* */
const videoList=["video.mp4" , "video1.mp4","video2.mp4"];
let current=0;
videoTitle.textContent=videoList[current];
video.src=videoList[current];
nextVideo.addEventListener('click', ()=>{
    current=(current+1)%videoList.length;
    video.src=videoList[current];
    videoTitle.textContent=videoList[current];
    togglePlay();
})
prevVideo.addEventListener('click', ()=>{
    if(current==0) 
        current=videoList.length-1;
    else
        current=(current-1);
    video.src=videoList[current];
    videoTitle.textContent=videoList[current];
    togglePlay();
})
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
    document.querySelector('.speed-bar').style.height= "16.6%";// 100 percent- (4-0.4) units. So 0.6 units= (100*0.6)/3.6 
    document.querySelector('.speed-bar').textContent="1x";
    console.log(video.src);
}
//Resource- https://www.w3schools.com/tags/av_event_loadeddata.asp
video.addEventListener('loadedmetadata', runafterload);
function togglePlay(){
    if(isPlaying==false){
        playButton.innerHTML="<i class='fas fa-pause'></i>";
        video.play();
    }
    else{
        playButton.innerHTML="<i class='fas fa-play'></i>";
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

/*FULLSCREEN */
fullscreen.addEventListener('click',function(){
    if (video.requestFullscreen) {
        video.requestFullscreen();
      } 
})

/*Full width */
/* fullwidth.addEventListener('click',function(){
    document.querySelector('.container').style.width="100%";
    document.querySelector('.container').style.height="60vh";
    video.style.height="60vh";
}) */
/*Toggle controls up and down */
playerControls.addEventListener('mouseenter',function(){
    playerControls.style.bottom="7px";
})
playerControls.addEventListener('mouseleave',function(){
    playerControls.style.bottom="-27px";
})
video.addEventListener('mouseenter',function(){
    playerControls.style.bottom="7px";
})
video.addEventListener('mouseleave',function(){
    playerControls.style.bottom="-27px";
})

/*SPEED BAR */
let speedChange=false;
document.querySelector('.speed-bar')
speedBar.addEventListener('mousemove',function(e){
    //console.log('h');
    if(speedChange){
        
        let y=e.pageY-this.offsetTop;
        let percent=y/this.offsetHeight;
        let height= Math.round(100*percent)+"%";
        //min speed=0.4 , max=4
        let playBackRate=percent*(4-0.4)+0.4;
        console.log(playBackRate);
        document.querySelector('.speed-bar').textContent=playBackRate.toFixed(2)+"x";//round to 2 decimal
        document.querySelector('.speed-bar').style.height= height;
        video.playbackRate=playBackRate;
    }
})
speedBar.addEventListener('mousedown',(e)=>{
    console.log(e.offsetY);
    speedChange=true;
})
window.addEventListener('mouseup',(e)=>{
    console.log(e.offsetY);
    speedChange=false;
})

/*Snap*/

snap.addEventListener('click',()=>{
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d');
    const width=video.videoWidth;//width of the media in its natural size!->VVI coz in css we set width of player as 200px. But videoWidth gives the natural size.
    const height=video.videoHeight;
    canvas.width=width;//set the canvas h and w to natural size of video(VVI)
    canvas.height=height;
    ctx.drawImage(video,0,0,width,height);
    const link=document.createElement('a');
    const data=canvas.toDataURL('image/jpeg');
    link.href=data;
    link.setAttribute('download','Video_snap');
    link.click();//!!
})