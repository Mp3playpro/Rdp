/*****YTPRO*******
Author: Prateek Chaubey
Version: 3.4.57
URI: https://github.com/prateek-chaubey/
*/


//DEBUG
/*var debug=false;
var Android={
pipvid:()=>{},
gohome:()=>{},
getInfo:()=>{},
oplink:()=>{},
downvid:()=>{}
};
if(window.eruda == null){
//ERUDA
window.location.href=`javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();`;
}
/**/


/*Few Stupid Inits*/
var YTProVer="3.45";
if(ytproNCode == undefined && ytproDecipher == undefined){
var ytproNCode=[];
var ytproDecipher=[];
}
var ytoldV="";
var isF=false;   //what is this for?
var isAP=false; // oh it's for bg play 
var isM=false; // no idea !!
var sTime=[];

if(localStorage.getItem("autoSpn") == null || localStorage.getItem("fitS") == null){
localStorage.setItem("autoSpn","true");
localStorage.setItem("fitS","true");
localStorage.setItem("fzoom","false");
}
if(localStorage.getItem("fzoom") == "true"){
document.getElementsByName("viewport")[0].setAttribute("content","");
}



if(window.location.pathname.indexOf("shorts") > -1){
ytoldV=window.location.pathname;
}
else{
ytoldV=(new URLSearchParams(window.location.search)).get('v') ;
}

/*Cleans the URL for various functions of the YTPRO*/
function ytproGetURL(o,p){
try{
var url=o;

if(p == "sig"){
var sig=(new URLSearchParams(o)).get('s');
url=(new URLSearchParams(o)).get('url');
sig=eval(ytproDecipher[0]+ytproDecipher[1]+"('"+decodeURIComponent(sig)+"');");
url=decodeURIComponent(url);
}
const components = new URL(decodeURIComponent(url));
const n = components.searchParams.get('n');
var nc=eval(ytproNCode[0]+ytproNCode[1]+"('"+n+"');");
components.searchParams.set('n',nc);
if(p == "sig"){
return  components.toString()+"&sig="+sig;
}
else{
return components.toString();
}
}catch{}
}


/*Dark and Light Mode*/
var c="#000";
var d="#f2f2f2";
var dislikes="...";

if(document.cookie.indexOf("PREF") < 0 || document.cookie.indexOf("f6=") < 0){
document.cookie.replace(
/(?<=^|;).+?(?=\=|;|$)/g,
name => location.hostname
.split(/\.(?=[^\.]+\.)/)
.reduceRight((acc, val, i, arr) => i ? arr[i]='.'+val+acc : (arr[i]='', arr), '')
.map(domain => document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`)
);
document.cookie="PREF=f6=400&f7=100;";
window.location.href=window.location.href;
}
if(document.cookie.indexOf("f6=400") > -1){
c ="#fff";d="rgba(255,255,255,0.1)";
}else{
c="#000";d="rgba(0,0,0,0.1)";
}
var downBtn=`<svg xmlns="http://www.w3.org/2000/svg" height="18" fill="${c}" viewBox="0 0 24 24" width="18" focusable="false"><path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path></svg>`;



/*Extract Functions , Credits:node-ytdl-core && @distube/ytdl-core*/
var extractFunctions = (body)=> {

/*Regex & Functions for Decipher & NCode*/
// NewPipeExtractor regexps
const DECIPHER_NAME_REGEXPS = [
  '\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\);',
  '\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)',
  // eslint-disable-next-line max-len
  '(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*""\\s*\\)',
  '([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(""\\)\\s*;',
];

// LavaPlayer regexps
const VARIABLE_PART = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const VARIABLE_PART_DEFINE = `\\"?${VARIABLE_PART}\\"?`;
const BEFORE_ACCESS = '(?:\\[\\"|\\.)';
const AFTER_ACCESS = '(?:\\"\\]|)';
const VARIABLE_PART_ACCESS = BEFORE_ACCESS + VARIABLE_PART + AFTER_ACCESS;
const REVERSE_PART = ':function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}';
const SLICE_PART = ':function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}';
const SPLICE_PART = ':function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}';
const SWAP_PART = ':function\\(a,b\\)\\{' +
      'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b(?:%a.length|)\\]=c(?:;return a)?\\}';

const DECIPHER_REGEXP = `function(?: ${VARIABLE_PART})?\\(a\\)\\{` +
  `a=a\\.split\\(""\\);\\s*` +
  `((?:(?:a=)?${VARIABLE_PART}${VARIABLE_PART_ACCESS}\\(a,\\d+\\);)+)` +
  `return a\\.join\\(""\\)` +
  `\\}`;

const HELPER_REGEXP = `var (${VARIABLE_PART})=\\{((?:(?:${
  VARIABLE_PART_DEFINE}${REVERSE_PART}|${
  VARIABLE_PART_DEFINE}${SLICE_PART}|${
  VARIABLE_PART_DEFINE}${SPLICE_PART}|${
  VARIABLE_PART_DEFINE}${SWAP_PART}),?\\n?)+)\\};`;

const N_TRANSFORM_REGEXP = 'function\\(\\s*(\\w+)\\s*\\)\\s*\\{' +
  'var\\s*(\\w+)=(?:\\1\\.split\\(""\\)|String\\.prototype\\.split\\.call\\(\\1,""\\)),' +
  '\\s*(\\w+)=(\\[.*?]);\\s*\\3\\[\\d+]' +
  '(.*?try)(\\{.*?})catch\\(\\s*(\\w+)\\s*\\)\\s*\\' +
  '{\\s*return"enhanced_except_([A-z0-9-]+)"\\s*\\+\\s*\\1\\s*}' +
  '\\s*return\\s*(\\2\\.join\\(""\\)|Array\\.prototype\\.join\\.call\\(\\2,""\\))};';


/*Matches the Regex*/

const matchRegex = (regex, str) => {
const match = str.match(new RegExp(regex, 's'));
if (!match) throw new Error(`Could not match ${regex}`);
return match;
};

const matchFirst = (regex, str) => matchRegex(regex, str)[0];

const matchGroup1 = (regex, str) => matchRegex(regex, str)[1];

const getFuncName = (body, regexps) => {
let fn;
for (const regex of regexps) {
try {
fn = matchGroup1(regex, body);
const idx = fn.indexOf('[0]');
if (idx > -1) {
fn = matchGroup1(`${fn.substring(idx, 0).replace(/\$/g, '\\$')}=\\[([a-zA-Z0-9$\\[\\]]{2,})\\]`, body);
}
break;
} catch (err) {
continue;
}
}
if (!fn || fn.includes('[')) throw Error();
return fn;
};






const extractDecipherFunc = body => {
try {
const DECIPHER_FUNC_NAME = 'ytproDecipher';
const helperObject = matchFirst(HELPER_REGEXP, body);
const decipherFunc = matchFirst(DECIPHER_REGEXP, body);
const resultFunc = `var ${DECIPHER_FUNC_NAME}=${decipherFunc};`;
const callerFunc = `${decipherFuncName}`;
return [helperObject + resultFunc , callerFunc];
} catch (e) {
return null;
}
};



const extractDecipherWithName = body => {
try {
const decipherFuncName = getFuncName(body, DECIPHER_NAME_REGEXPS);
const funcPattern = `(${decipherFuncName.replace(/\$/g, '\\$')}=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})`;
const decipherFunc = `var ${matchGroup1(funcPattern, body)};`;
const helperObjectName = matchGroup1(';([A-Za-z0-9_\\$]{2,})\\.\\w+\\(', decipherFunc);
const helperPattern = `(var ${helperObjectName.replace(/\$/g, '\\$')}=\\{[\\s\\S]+?\\}\\};)`;
const helperObject = matchGroup1(helperPattern, body);
const callerFunc = `${decipherFuncName}`;
return [helperObject + decipherFunc , callerFunc];
} catch (e) {
return null;
}
};





const getExtractFunctions = (extractFunctions, body) => {
for (const extractFunction of extractFunctions) {
try {
const func = extractFunction(body);
if (!func) continue;
return func;
} catch (err) {
continue;
}
}
return null;
};






const extractDecipher = body => {
const decipherFunc = getExtractFunctions([extractDecipherWithName, extractDecipherFunc], body);
if (!decipherFunc) {
console.warn('WARNING: Could not parse decipher function.\n' );
}
return decipherFunc;
};





const extractNTransformFunc = body => {
try {
const N_TRANSFORM_FUNC_NAME = 'ytproNCode';
const nFunc = matchFirst(N_TRANSFORM_REGEXP, body);
const resultFunc = `var ${N_TRANSFORM_FUNC_NAME}=${nFunc}`;
const callerFunc = `${N_TRANSFORM_FUNC_NAME}`;
return [resultFunc , callerFunc];
} catch (e) {
return null;
}
};




const extractNTransform = body => {
const nTransformFunc = getExtractFunctions([extractNTransformFunc], body);
if (!nTransformFunc) {
console.warn('WARNING: Could not parse nTransform function.\n');
}
return nTransformFunc;
};


ytproDecipher=extractDecipher(body);
ytproNCode=extractNTransform(body);




};



function insertAfter(referenceNode, newNode) {try{referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);}catch{}}

/*Add Settings Tab*/
setInterval(()=>{
if(document.getElementById("setDiv") == null){
var setDiv=document.createElement("div");
setDiv.setAttribute("style",`
height:30px;width:30px;
z-index:9999999999;
font-size:22px;
text-align:center;line-height:35px;
`);
setDiv.setAttribute("id","setDiv");
var svg=document.createElement("div");
svg.innerHTML=`<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 22 22" width="22"  id="hSett"><path d="M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z"></path></svg>
`;
setDiv.appendChild(svg);
insertAfter(document.getElementsByTagName("ytm-home-logo")[0],setDiv);

if(document.getElementById("hSett") != null){
document.getElementById("hSett").addEventListener("click",
function(ev){
window.location.hash="settings";
});
}
}


},50);



/*Fetches da base.js*/
var scripts = document.getElementsByTagName('script');
for(var i=0;i<scripts.length;i++){
if(scripts[i].src.indexOf("/base.js") > 0){
fetch(scripts[i].src).then((res) => res.text()).then((r) => extractFunctions(r));
}
}

/*Dislikes To Locale, Credits: Return YT Dislikes*/
function getDislikesInLocale(num){
var nn=num;
if (num < 1000){
nn = num;
}
else{
const int = Math.floor(Math.log10(num) - 2);
const decimal = int + (int % 3 ? 1 : 0);
const value = Math.floor(num / 10 ** decimal);
nn= value * 10 ** decimal;
}
let userLocales;
if (document.documentElement.lang) {
userLocales = document.documentElement.lang;
} else if (navigator.language) {
userLocales = navigator.language;
} else {
try {
userLocales = new URL(
Array.from(document.querySelectorAll("head > link[rel='search']"))
?.find((n) => n?.getAttribute("href")?.includes("?locale="))
?.getAttribute("href")
)?.searchParams?.get("locale");
} catch {
userLocales = "en";
}
}
return Intl.NumberFormat(userLocales, {
notation: "compact",
compactDisplay: "short",
}).format(nn);
}



/*Skips the bad part :)*/
function skipSponsor(){
var sDiv=document.createElement("div");
sDiv.setAttribute("style",`height:3px;pointer-events:none;width:100%;background:transparent;position:fixed;z-index:99999999;`)
sDiv.setAttribute("id","sDiv");
var dur=document.getElementsByClassName('video-stream')[0].duration;

for(var x in sTime){
var s1=document.createElement("div");
var s2=sTime[x];
s1.setAttribute("style",`height:3px;width:${(100/dur) * (s2[1]-s2[0])}%;background:#0f8;position:fixed;z-index:99999999;left:${(100/dur) * s2[0]}%;`)
sDiv.appendChild(s1);
}
if(document.getElementById("sDiv") == null){
if(document.getElementsByClassName('YtmChapteredProgressBarHost')[0] != null){
document.getElementsByClassName('YtmChapteredProgressBarHost')[0].appendChild(sDiv);
}else{
try{document.getElementsByClassName('YtmProgressBarProgressBarLine')[0].appendChild(sDiv);}catch{}
}
}
}





/*Fetch The Dislikes*/
async function fDislikes(){ 
var vID="";
var Url=new URL(window.location.href);
if(Url.pathname.indexOf("shorts") > -1){
vID=Url.pathname.substr(8,Url.pathname.length);
}
else if(Url.pathname.indexOf("watch") > -1){
vID=Url.searchParams.get("v");
}


fetch("https://returnyoutubedislikeapi.com/votes?videoId="+vID)
.then(response => {
return response.json();
}).then(jsonObject => {
if('dislikes' in jsonObject){
dislikes=getDislikesInLocale(parseInt(jsonObject.dislikes));
}
}).catch(error => {});

}
fDislikes();


if(window.location.pathname.indexOf("watch") > -1){

/*Check For Sponsorships*/
fetch("https://sponsor.ajay.app/api/skipSegments?videoID="+(new URLSearchParams(window.location.search)).get('v'))
.then(response => {
return response.json();
}).then(jsonObject => {
for(var x in jsonObject){
var time=jsonObject[x].segment;
sTime.push(time);
}
}).catch(error => {});




/*Skip the Sponsor*/
document.getElementsByClassName('video-stream')[0].ontimeupdate=()=>{
var cur=document.getElementsByClassName('video-stream')[0].currentTime;
for(var x in sTime){
var s2=sTime[x];
if(Math.floor(cur) == Math.floor(s2[0])){
if(localStorage.getItem("autoSpn") == "true"){
document.getElementsByClassName('video-stream')[0].currentTime=s2[1];
addSkipper(s2[0]);
}
}
}
};


setInterval(skipSponsor,50);


}




if((window.location.pathname.indexOf("watch") > -1) || (window.location.pathname.indexOf("shorts") > -1)){
var unV=setInterval(() => {
/*Set Orientation*/

var v=document.getElementsByClassName('video-stream')[0].getBoundingClientRect();
if(v.height > v.width){
Android.fullScreen(true);
}
else{
Android.fullScreen(false);
}

/*Unmute The Video*/ 

document.getElementsByClassName('video-stream')[0].muted=false;
if(!document.getElementsByClassName('video-stream')[0].muted){
clearInterval(unV);
}

}, 5);

}


/*Add Skip Sponsor Element*/
function addSkipper(sT){
var sSDiv=document.createElement("div");
sSDiv.setAttribute("style",`
height:50px;${(screen.width > screen.height) ? "width:50%;" : "width:80%;"}overflow:auto;background:rgba(130,130,130,.3);
backdrop-filter:blur(6px);
position:absolute;bottom:40px;
line-height:50px;
left:calc(15% / 2 );padding-left:10px;padding-right:10px;
z-index:99999999999999;text-align:center;border-radius:25px;
color:white;text-align:center;
`);
sSDiv.innerHTML=`<span style="height:30px;line-height:30px;margin-top:10px;display:block;font-family:monospace;font-size:16px;float:left;">Skipped Sponsor</span>
<span style="height:30px;line-height:44px;float:right;padding-right:30px;margin-top:10px;display:block;padding-left:30px;border-left:1px solid white;">
<svg onclick="this.parentElement.parentElement.remove();document.getElementsByClassName('video-stream')[0].currentTime=${sT+1};" xmlns="http://www.w3.org/2000/svg" width="23" height="23" style="margin-top:0px;" fill="currentColor" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
</svg>
<svg onclick="this.parentElement.parentElement.remove();" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-left:30px;" fill="#f24" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
</svg>
</span>`;
document.getElementById("player-control-container").appendChild(sSDiv);
setTimeout(()=>{sSDiv.remove();},5000);
}


/*Funtion to set Element Styles*/
function sty(e,v){
var s={
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"550",
height:"65%",
width:"80px",
borderRadius:"20px",
background:d,
fontSize:"12px",
marginRight:"5px",
textAlign:"center"
};
for(x in s){
e.style[x]=s[x];
}
}

/*The settings tab*/
async function ytproSettings(){
var ytpSet=document.createElement("div");
var ytpSetI=document.createElement("div");
ytpSet.setAttribute("id","settingsprodiv");
ytpSetI.setAttribute("id","ssprodivI");
ytpSet.setAttribute("style",`
height:100%;width:100%;position:fixed;top:0;left:0;
display:flex;justify-content:center;
background:rgba(0,0,0,0.4);
z-index:9999;
`);
ytpSet.addEventListener("click",
function(ev){
if(!(ev.target == ytpSetI  || ytpSetI.contains(ev.target))){
history.back();
}
});

ytpSetI.setAttribute("style",`
height:65%;width:85%;overflow:auto;background:#0f0f0f;
position:absolute;bottom:20px;
z-index:99999999999999;padding:20px;text-align:center;border-radius:25px;color:white;text-align:center;
`);

ytpSetI.innerHTML=`<style>
#settingsprodiv a{text-decoration:underline;color:white;} #settingsprodiv li{list-style:none; display:flex;align-items:center;justify-content:center;color:#fff;border-radius:25px;padding:10px;background:#000;margin:5px;}
#ssprodivI div{
height:10px;
width:calc(100% - 20px);
padding:10px;
font-size:1.35rem;
font-family:monospace;
text-align:left;
display:block;
}
#ssprodivI div span{
display:block;
height:15px;
width:30px;
border-radius:20px;
float:right;
position:relative;
background:rgba(255,0,0,.5);
}
#ssprodivI div span b{
display:block;
height:20px;
width:20px;
position:absolute;
right:-6px;
top:-2px;
border-radius:50px;
background:rgba(255,0,220,5);
}
#ssprodivI div input::placeholder{color:white;}
#ssprodivI div input,#ssprodivI div button{
height:30px;
background:rgba(255,255,255,.1);
width:100%;
border:0;
border-radius:20px;
padding:10px;
font-size:1.25rem;
}
#ssprodivI div button{
background:linear-gradient(120deg,#038,#0a3);
font-size:1.25rem;
width:47%;
border-radius:50px;
padding:0;
color:white;
}

</style>`;
ytpSetI.innerHTML+=`<b style='font-size:18px' >YT PRO Settings</b>
<span style="font-size:10px">v${YTProVer}</span>
<br><br>
<div><input type="url" placeholder="Enter Youtube URL" onkeyup="searchUrl(this,event)"></div>
<br>
<div style="text-align:center" ><button onclick="showHearts();">Hearted Videos</button>
<button style="margin-left:10px" onclick="checkUpdates();">Check for Updates</button>
</div>
<br>
<div>Autoskip Sponsors <span onclick="sttCnf(this,'autoSpn');" style="${sttCnf(0,0,"autoSpn")}" ><b style="${sttCnf(0,1,"autoSpn")}"></b></span></div>
<br>
<div>Auto FitScreen <span onclick="sttCnf(this,'fitS');" style="${sttCnf(0,0,"fitS")}" ><b style="${sttCnf(0,1,"fitS")}" ></b></span></div> 
<br>
<div>Force Zoom <span onclick="sttCnf(this,'fzoom');" style="${sttCnf(0,0,"fzoom")}" ><b style="${sttCnf(0,1,"fzoom")}" ></b></span></div> 
<br>
<div>Hide Shorts <span onclick="sttCnf(this,'shorts');" style="${sttCnf(0,0,"shorts")}" ><b style="${sttCnf(0,1,"shorts")}" ></b></span></div> 
<br>
<div style="display:flex;justify-content:center;font-family:cursive;text-align:center;font-size:2.25rem;font-weight:bolder;color:#0f8;">Made with 
&#x2665; by Prateek Chaubey</div>
<br><br>
<div style="font-size:1.25rem;"><b style="font-weight:bold">Disclaimer</b>: This is an unofficial OSS Youtube Mod , all the logos and brand names are property of Google LLC.<br>
You can get the source code at <a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO')" > https://github.com/prateek-chaubey/YTPRO</a>
<br><br><center>
<a href="#" onclick="Android.oplink('https://github.com/prateek-chaubey/YTPRO/issues')" >Report Bugs</a>
</center></div>`;

document.body.appendChild(ytpSet);
ytpSet.appendChild(ytpSetI);

}

function searchUrl(x,e){
if(e.keyCode === 13 || e === "Enter"){
window.location.href=x.value;
}
}

function checkUpdates(){
if(parseFloat(Android.getInfo()) < parseFloat(YTProVer) ){
updateModel();
}else{
alert("Your app is up to date");
}

fetch('https://cdn.jsdelivr.net/npm/ytpro', {cache: 'reload'});
fetch('https://cdn.jsdelivr.net/npm/ytpro/bgplay.js', {cache: 'reload'});
}


/*Set Configration*/
function sttCnf(x,z,y){

/*Way too complex to understand*/

if(typeof y == "string"){

if(localStorage.getItem(y) != "true"){
if(z == 1){
return 'background:rgba(255,255,255,.7);left:-6px;'
}else{
return 'background:rgba(255,255,255,.1)';
}
}else{
if(z == 1){
return 'background:rgba(255,50,50,1);left:auto;right:-6px;'
}else{
return 'background:rgba(255,50,50,.5)';
}
}
}
if(localStorage.getItem(z) == "true"){
localStorage.setItem(z,"false");
x.style.background="rgba(255,255,255,.1)";
x.children[0].style.left="-6px";
x.children[0].style.background="rgba(255,255,255,.7)";
}
else{
localStorage.setItem(z,"true");
