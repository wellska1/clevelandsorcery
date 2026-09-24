'use strict';
const $=id=>document.getElementById(id);
const canvas=$('world'),ctx=canvas.getContext('2d');
const WORLD={w:1024,h:704},keys={},clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const palette={o:'#22352f',h:'#493a29',H:'#6d5234',s:'#efc18b',S:'#ca9767',e:'#182c30',t:'#438b8d',T:'#2b616e',b:'#354b5c',B:'#1e3441',w:'#f4e7c5',g:'#8eb894',G:'#557a58',r:'#bb684c',y:'#d6ad57',Y:'#eed389',m:'#9d8866',M:'#716652',a:'#96aaa8',A:'#617979',p:'#e8ada0'};
const spritePalettes={
  snake:{...palette,g:'#438fe0',G:'#254f9b',v:'#86c9f6'},
  droid:{...palette,q:'#eee0b5',Q:'#cab98d',d:'#968567',D:'#514e42'}
};
const spriteData={
gray:['.....hhhhhh.....','....hHHHHHhh....','...hHHHHHHHh....','...hhhssshhh....','....seesseh.....','....ssssss......','.....ssss.......','...TTttttTT.....','..sTttttttTs....','..sTttttttTs....','..sTTttttTTs....','...TTyyyyTT.....','....bbbbbb......','....bb..bb......','....bb..bb......','...BBB..BBB.....'],
kenobi:['................','................','................','................','...hh.....hh....','...hHh...hHh....','...hHHyyyHHh....','....yeYYeyy.....','....YYhYYYY.....','.....YwYYY......','...yyyyyyyy.hh..','..yYYyyyyyYyh...','..yYyyyyyyyY....','...yyyyyyyy.....','...hh...hh......','...hh...hh......'],
mole:['................','.....mmmm.......','...mMMMMMMm.....','..mMMMMMMMMm....','..MwwMwwMMMm....','..MwwewwMMMm....','..MwwMwwMpMM....','...MMMppMMMm....','....MMMMMM......','...rrryrrr......','..prrrrrrrp.....','..prryyrrrp.....','...rrrrrrr......','....MM.MM.......','...ppp.ppp......','................'],
squirrel:['..........HHH...','..HH..HH.HyyyH..','..HyHHHyHyyyyH..','..HyyyyyHyyyH...','..HyeeyeHyyH....','...yyyyyHyyH....','....ywy.HyyH....','...aaaaaHyyH....','..aAayaAaHH.....','..yAaaaAy.......','...AaaaA........','...AyyyA........','....HHHH........','....H..H........','...HH..HH.......','................'],
droid:[
'........................',
'...........ddd..........',
'..........dqqQd.........',
'..........dqeQQQ........',
'..........dqqQQQd.......',
'..........dQQQQQd.......',
'..........dQd.QQd.......',
'..........dQd..Qd.......',
'..........dDd...........',
'..........dQd...........',
'.......dd.dQd.dd........',
'......dQQQQQQQQQd.......',
'......dQ.dqqQd.Qd.......',
'......dQ.dqQQd.Qd.......',
'......dD.dQQQd.Dd.......',
'......Qd..dDd..dQ.......',
'.....dQ...dQd...Qd......',
'.....dQ...dQd...Qd......',
'.....DD..dQQQd..DD......',
'.....Qd..dQQQd..dQ......',
'........dQd.dQd.........',
'........dQd.dQd.........',
'........Qd...dQ.........',
'........Qd...dQ.........',
'.......dDd...dDd........',
'.......dQ.....Qd........',
'.......dQ.....Qd........',
'.......dQ.....Qd........',
'.......dQ.....Qd........',
'.......DD.....DD........',
'......dQQd...dQQd.......',
'......dddd...dddd.......'
],
snake:['......GGGG......','.....GvvggG.....','.....GyeeyG.....','.....GggggG.....','......GppG......','....rrGGGGrr....','...rArrrrrAr....','..gAarryrraAg...','..gArrrrrraAg...','...ArrrrrraA....','....GGvgGG......','....GvggG.......','....GvgG.GGG....','...GvggGGgggG...','...GGvgggggGG...','.....GGGGGG.....'],
todd:['.....y.y.y......','.....yyyyy......','....hhhhhhh.....','....hsssssh.....','....sessees.....','....sssssss.....','.....sssss......','...rrrrrrrr.....','..srwwrrwwrs....','..srrrrrrrrs....','..srrryyrrrs....','...rrrrrrrr.....','....bbbbbb......','....bb..bb......','...hhh..hhh.....','................'],
wizard:['......t.........','.....ttt........','....ttttt.......','...ttttttt......','..TTTTTTTTT.....','....seses.......','....wwsww.......','....wwwww.......','...ttwwwtt......','..tttwwwttt.....','..stttwttts.....','...ttttttt......','...tttyttt......','...ttttttt......','..TTTTTTTTT.....','................'],
hil:['......r.........','.....rrr........','....rrrrr.......','...rrrrrrr......','..rrrrrrrrr.....','....seses.......','....wwsww.......','....wwwww.......','...rrwwwrr......','..rrrwwwrrr.....','..srrrwrrrs.....','...rrrrrrr......','...rrryrrr......','...rrrrrrr......','..rrrrrrrrr.....','................'],
beard:['.....hhhhhh.....','....hHHHHHHh....','....hsssshHh....','....sesesseh....','....hsssshHh....','....hHHHHHHh....','...hhHHHHHhhh...','..GHHHHHHHHGGG..','.sGGHHHHHHHGGGs.','.sGGGHHHHHGGGGs.','.sGGGGHHHGGGGGs.','..GGGGyyGGGGGG..','...GGGGGGGGGG...','....HHH.HHH.....','...HHHH.HHHH....','................'],
santa:['.....rrrrrr.....','....rrrrrrrr....','...rrrrrrrrrw...','...wwwwwwww.....','....seses.......','....wwsww.......','....wwwww.......','...rrwwwrr......','..rrrwwwrrr.....','..srrrwrrrs.....','...rrryrrr......','...rrryrrr......','...rrrrrrr......','....rr.rr.......','...hhh.hhh......','................']
};
const sprites={};
function initSprites(){
  for(const [name,rows] of Object.entries(spriteData)){
    let c=document.createElement('canvas');c.width=Math.max(...rows.map(row=>row.length));c.height=rows.length;let g=c.getContext('2d'),colors=spritePalettes[name]||palette;
    rows.forEach((row,y)=>[...row].forEach((p,x)=>{if(p!=='.'){g.fillStyle=colors[p]||'#fff';g.fillRect(x,y,1,1)}}));sprites[name]=c;
  }
  sprites.cobris=makeCobrisPortrait();
  Ship.makeSprites();
  $('gray-portrait').src=sprites.gray.toDataURL();$('kenobi-portrait').src=sprites.kenobi.toDataURL();
}
function makeCobrisPortrait(){
  const c=document.createElement('canvas');c.width=40;c.height=42;const g=c.getContext('2d');
  const fill=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h)},dark='#146a70',base='#28b8ad',light='#81e3cf';
  fill(7,31,26,9,dark);fill(3,33,34,5,dark);fill(6,32,28,6,base);fill(8,32,23,2,light);fill(12,27,17,10,dark);fill(14,27,13,9,base);fill(18,29,4,7,light);fill(9,39,23,2,dark);
  const heads=[{x:1,y:11},{x:7,y:7},{x:13,y:3},{x:22,y:3},{x:28,y:7},{x:34,y:11}];
  for(const {x,y} of heads){
    const end=x<20?18:22,startY=y+6;
    for(let yy=29;yy>=startY;yy--){const f=(yy-startY)/(29-startY),xx=Math.round((x+2)*(1-f)+end*f);fill(xx-2,yy,5,1,dark);fill(xx-1,yy,3,1,base);fill(xx-1,yy,1,1,light)}
  }
  for(const {x,y} of heads){
    fill(x+1,y,4,1,dark);fill(x,y+1,6,5,dark);fill(x+1,y+1,4,4,base);fill(x+1,y+1,3,1,light);
    fill(x+1,y+2,1,1,'#f4d270');fill(x+4,y+2,1,1,'#f4d270');fill(x+2,y+4,2,1,dark);fill(x+2,y+5,2,1,light);
  }
  fill(13,0,1,3,'#edcb72');fill(15,0,1,3,'#edcb72');fill(17,0,1,3,'#edcb72');fill(13,2,5,1,'#b99145');
  return c;
}
function sprite(type,x,y,scale=2,flip=false,bob=0){
  ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));if(flip)ctx.scale(-1,1);
  const image=sprites[type]||sprites.wizard,h=(type==='droid'?22:type.startsWith('b2')?23:16)*scale,w=h*image.width/image.height;
  ctx.drawImage(image,-w/2,-h,w,h);
  if(type==='gray'){rect(6*scale,-10*scale,scale,8*scale,'#d5e1d4');rect(4*scale,-4*scale,5*scale,scale,'#d9b66a');rect(6*scale,-3*scale,scale,2*scale,'#7a6040')}
  ctx.restore();
}
let state,clock=0,last=0,frameCount=0,fpsLast=0,fps=60,modalReturn='title',dialogQueue=[],afterDialog=null,nearest=null,battleTimer=0;
const npcs=[
  {id:'mole',name:'Mortimer Mole',type:'mole',x:276,y:427},
  {id:'professor',name:'Professor Nutty',type:'squirrel',x:480,y:344},
  {id:'todd',name:'Prince Todd',type:'todd',x:843,y:402},
  {id:'wizard',name:'Gilgamesh',type:'wizard',x:188,y:251},
  {id:'hil',name:'Hilgamesh',type:'hil',x:224,y:254},
  {id:'beard',name:'Dumbledore',type:'beard',x:260,y:251},
  {id:'elf',name:'Daddy Republic scout',type:'santa',x:383,y:526},
  {id:'chest',name:'Trail supply chest',type:'chest',x:382,y:407},
  {id:'sign',name:'Greenwood signpost',type:'sign',x:551,y:398},
  {id:'camp',name:'Campfire · rest & recover',type:'camp',x:226,y:532},
  {id:'droid',name:'Alliance Sentry',type:'droid',x:633,y:347},
  {id:'scales',name:'Scales',type:'snake',x:858,y:328}
];
const trees=[];
function rand(x,y=0){let n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n)}
for(let y=32;y<704;y+=62)for(let x=22;x<1024;x+=57){
  let xx=x+rand(x,y)*22,yy=y+rand(y,x)*18;
  const clear=(xx>130&&xx<340&&yy>210&&yy<580)||(xx>300&&xx<640&&yy>285&&yy<570)||(xx>570&&xx<940&&yy>280&&yy<440)||(xx>150&&xx<850&&yy>305&&yy<385);
  if(!clear&&!(xx>700&&xx<766))trees.push({x:xx,y:yy,size:0.9+rand(x+1,y)*.35});
}
function fresh(){
 state={mode:'title',chapter:1,p:{x:219,y:439,dir:1},dog:{x:196,y:455},hp:80,maxHp:80,fp:6,maxFp:6,snacks:3,acorns:0,level:1,quest:0,chest:false,droid:false,scales:false,won:false,enemy:null,busy:false,guard:false,flash:0,hitText:'',hitTime:0,returnMode:'explore'};
}
function show(id,yes=true){$(id).classList.toggle('hidden',!yes)}
function hud(){
 $('gray-hp-bar').style.width=state.hp/state.maxHp*100+'%';
 $('gray-stats').innerHTML=`${state.hp} / ${state.maxHp} HP <span>·</span> ${state.fp} / ${state.maxFp} FP`;
 $('level').textContent=state.level;$('snack-count').textContent=state.snacks+' trail snacks';$('acorn-count').textContent=state.acorns;
 $('dog-status').textContent=state.mode==='battle'?'I’ve got your back.':'Ready for anything.';
 $('objective').textContent=questTitle();
}
function questTitle(){
 if(state.chapter===2)return Ship.goal();
 if(state.chapter===3)return Underdeep.goal();
 if(state.chapter===4)return NorthPole.goal();
 return ['Find Mortimer beside his burrow','Meet Professor Nutty on the east path','Defeat the Alliance Sentry by the bridge','Cross the bridge and confront Scales','Greenwood is safe. For now.'][state.quest];
}
function start(){
 fresh();state.mode='explore';show('title-screen',false);show('location');show('objective');show('pause-btn');hud();canvas.focus();
 say([['Kyle','gray','A quiet walk, a little fencing practice, and absolutely no saving the world. Sound good, Kenobi?'],['Kenobi','kenobi','Woof! [He immediately hears someone panicking beside the burrow to the northeast.]'],['Kyle','gray','Okay. One tiny detour. Use WASD or the arrow keys to walk, then press E near someone to talk.']]);
 tone(392,.1);tone(523,.18,.13);
}
function say(lines,done){
 state.returnMode=state.mode==='title'?'title':'explore';state.mode='dialog';dialogQueue=lines.slice();afterDialog=done||null;show('nearby',false);show('dialog');nextLine();
}
function nextLine(){
 if(dialogQueue.length){let [name,type,text]=dialogQueue.shift();$('dialog-name').textContent=name;$('dialog-text').textContent=text;$('dialog-portrait').src=(sprites[type]||sprites.gray).toDataURL();tone(440,.025);return}
 show('dialog',false);state.mode='explore';let fn=afterDialog;afterDialog=null;if(fn)fn();hud();canvas.focus();
}
function availableNPCs(){
 if(state.chapter===2)return Ship.entities();
 if(state.chapter===3)return Underdeep.entities();
 if(state.chapter===4)return NorthPole.entities();
 return npcs.filter(n=>!(n.id==='droid'&&state.droid)&&!(n.id==='scales'&&state.scales));
}
function interact(){
 if(state.mode==='dialog'){nextLine();return}if(state.mode!=='explore')return;
 let n=nearest;if(!n)return;
 if(state.chapter===2){Ship.interact(n);return}
 if(state.chapter===3){Underdeep.interact(n);return}
 if(state.chapter===4){NorthPole.interact(n);return}
 if(n.id==='mole'){
   if(state.quest===0)say([['Mortimer Mole','mole','Oh dear. Oh dear. I thought those marching droids were unusually shiny worms. My glasses are NOT helping.'],['Kyle','gray','Droids? Here in Greenwood?'],['Mortimer Mole','mole','The Corporate Alliance! They want our bridge. Professor Nutty is gathering the Nut Brigade along the path to the east. Please find him!'],['Kenobi','kenobi','[Kenobi gently nudges Mortimer’s glasses back onto his nose.]'],['Mortimer Mole','mole','Thank you, brave... rather fluffy person. Take these emergency acorns. I prefer squiggly worms anyway.']],()=>{state.quest=1;state.acorns+=5});
   else say([['Mortimer Mole','mole',state.won?'The bridge is safe? Wonderful! I can get back to being nervous about normal things. Like especially wiggly worms.':'The professor is east along the path. He has a helmet. Or a very shiny walnut. Hard to tell.']]);
 }else if(n.id==='professor'){
   if(state.quest===0)say([['Professor Nutty','squirrel','Attention, recruit! Mortimer has our latest report. Speak to him by the burrow southwest of here.']]);
   else if(state.quest===1)say([['Professor Nutty','squirrel','Kyle! Kenobi! Excellent. The Nut Brigade is ready. Mostly. Private Hazelnut has eaten his ammunition.'],['Kyle','gray','Then we’ll take the first move. Like chess: control the center.'],['Professor Nutty','squirrel','Precisely! There is an Alliance Sentry guarding the bridge to the east. Defeat it, then find Scales on the far side.'],['Professor Nutty','squirrel','Your fencing lunge never runs out. Knight’s Gambit uses focus. Build a block fort to guard and regain focus. Kenobi will help on every attack!']],()=>{state.quest=2});
   else say([['Professor Nutty','squirrel',state.won?'A victory for the ages! And for snacks. Mostly the ages.':'Keep east along the path, recruit. The Nut Brigade is covering your flank. With acorns.']]);
 }else if(n.id==='droid'){
   if(state.quest<2)say([['Alliance Sentry','droid','BRIDGE CLOSED. PLEASE CONSULT YOUR LOCAL SQUIRREL COMMANDER.'],['Kyle','gray','We should talk to Mortimer and Professor Nutty first.']]);
   else say([['Alliance Sentry','droid','GREENWOOD IS NOW CORPORATE PROPERTY. PLEASE SURRENDER ALL ACORNS.'],['Kyle','gray','I don’t think you’ve met my dog.']],()=>beginBattle('droid'));
 }else if(n.id==='scales'){
   if(!state.droid)say([['Scales','snake','The bridge belongs to Cobris. Go bother the sentry, little hero.']]);
   else say([['Scales','snake','A child, a dog, and a few squirrels? King Cobris has six heads. You cannot outthink all of them.'],['Kyle','gray','Maybe not. But I only need to outthink you.'],['Kenobi','kenobi','Grrrr. [Kenobi takes this personally.]']],()=>beginBattle('scales'));
 }else if(n.id==='chest'){
   if(state.chest)say([['Kyle','gray','All packed! We already collected these supplies.']]);
   else say([['Kyle','gray','A Nut Brigade supply chest! Two trail snacks and ten acorns. No worms. Sorry, Mortimer.']],()=>{state.chest=true;state.snacks+=2;state.acorns+=10;tone(660,.15)});
 }else if(n.id==='camp'){
   say([['Kyle','gray','Let’s take a breather, Kenobi. Even heroes need snack breaks.'],['Kenobi','kenobi','[Kenobi curls up beside the warm fire. Health and focus fully restored.]']],()=>{state.hp=state.maxHp;state.fp=state.maxFp});
 }else if(n.id==='todd'){
   say([['Todd','todd',state.won?'I saved the day! Did anyone see which part was on purpose?':'Gilgamesh said not to touch anything. Hilgamesh said ESPECIALLY not that lever. So naturally I tripped over it.'],['Kyle','gray',state.won?'You did great, Todd. Maybe stay away from the drawbridge.':'Stay here, Todd. We’ll handle Scales. Try not to... actually, just be yourself.']]);
 }else if(n.id==='wizard')say([['Gilgamesh','wizard','I watch over Prince Todd. My cousin Hilgamesh also watches over Prince Todd. Somehow, this is not enough watching.'],['Gilgamesh','wizard','If you see him across the bridge, please ask him not to touch anything that looks important.']] );
 else if(n.id==='hil')say([['Hilgamesh','hil','Gilgamesh has a theory that Todd’s accidents are a rare kind of magic. I have a theory that he needs better shoes.']] );
 else if(n.id==='beard')say([['Dumbledore','beard','I help the cousins with the heavy lifting. Mostly this means lifting Todd out of places he should not be.'],['Dumbledore','beard','Rest by the campfire to the south if the road gets rough. Strength grows back. Courage stays with you.']] );
 else if(n.id==='elf')say([['Daddy Republic scout','santa','Greetings from Santa! The Daddy Republic stands with Greenwood. Cobris will not turn our workshops into droid factories.'],['Daddy Republic scout','santa','Santa says bravery is helping someone even when you are scared. Also, bring a scarf. He always says that.']] );
 else if(n.id==='sign')say([['Greenwood signpost','squirrel','WEST: Mossbrook & Mortimer’s Burrow. EAST: Oakbridge. SOUTHWEST: campfire. WARNING: squirrels have right of way.']] );
}
function beginBattle(kind){
 state.mode='battle';state.busy=false;state.guard=false;state.hitTime=0;state.flash=0;state.hitTarget=null;
 const enemies={droid:{name:'ALLIANCE SENTRY',hp:78},scales:{name:'SCALES · THE KING’S RIGHT HAND',hp:138},b2:{name:'B2 HEAVY SENTRY',hp:140},b2captain:{name:'B2 COMMANDER · BULWARK',hp:205},caveguard:{name:'BURROW WARDEN',hp:172},caveking:{name:'THE HOLLOW TYRANT',hp:235},frostguard:{name:'BLIZZARD SENTINEL',hp:205},krampus:{name:'KRAMPUS · FROST MARSHAL',hp:272}};
 const enemy=enemies[kind];state.enemy={kind,...enemy,max:enemy.hp,turn:0};
 show('dialog',false);show('location',false);show('objective',false);show('pause-btn',false);show('nearby',false);show('battle-ui');
 $('battle-log').textContent='Kyle’s turn. Choose a move. Kenobi will follow your lead.';
 battleHud();hud();tone(220,.1);tone(277,.1,.1);tone(330,.2,.2);
}
function battleHud(){
 const e=state.enemy;if(!e)return;$('enemy-name').textContent=e.name;$('enemy-bar').style.width=Math.max(0,e.hp)/e.max*100+'%';$('enemy-hp').textContent=`${Math.max(0,e.hp)} / ${e.max} HP`;
 document.querySelectorAll('[data-action]').forEach(b=>b.disabled=state.busy||(b.dataset.action==='chess'&&state.fp<3)||(b.dataset.action==='snack'&&state.snacks<=0));hud();
}
function action(kind){
 if(state.mode!=='battle'||state.busy)return;const e=state.enemy;let damage=0,text='';
 if(kind==='chess'){if(state.fp<3)return;state.fp-=3;damage=28;text='Knight’s Gambit! Kyle spots an opening for 28 damage.'}
 else if(kind==='lunge'){damage=18;text='En garde! Kyle’s fencing lunge hits for 18 damage.'}
 else if(kind==='build'){state.guard=true;state.fp=Math.min(state.maxFp,state.fp+2);text='Kyle builds a block fort! Next hit reduced; +2 focus.'}
 else if(kind==='snack'){if(state.snacks<=0)return;state.snacks--;let h=state.hp;state.hp=Math.min(state.maxHp,state.hp+35);text=`Snack break! Kyle recovers ${state.hp-h} HP.`}
 else return;
 if(damage){damage+=7;text+=' Kenobi pounces for 7 more!';e.hp-=damage;state.hitText='−'+damage;state.hitTarget='enemy';state.hitTime=.8;state.flash=.15;tone(kind==='chess'?660:440,.12)}
 else tone(523,.12);
 if(e.kind==='scales'&&e.turn===2){e.hp-=22;text+=' Todd trips into a crate. It bonks Scales for 22!';state.hitText='BONK!';state.hitTime=1.2}
 $('battle-log').textContent=text;state.busy=true;battleTimer=1.35;battleHud();
}
function enemyTurn(){
 if(state.enemy.hp<=0){winBattle();return}
 const e=state.enemy;const heavy=e.turn%3===2,isB2=e.kind.startsWith('b2');
 let raw=isB2?(e.kind==='b2captain'?(heavy?32:18):(heavy?27:16)):(e.kind==='droid'?12:(heavy?23:16)),hit=state.guard?Math.ceil(raw*.25):raw;
 state.hp=Math.max(0,state.hp-hit);e.turn++;state.hitText='−'+hit;state.hitTime=.8;state.hitTarget='gray';
 const enemyLine=isB2?(heavy?'The B2 fires its charged arm cannon. ':'The B2 fires a wrist-blaster burst. '):e.kind==='droid'?'The sentry swings its clanking arm. ':e.kind==='caveguard'?(heavy?'The Burrow Warden whips a crushing tail strike. ':'The Burrow Warden jabs with a chipped spear. '):e.kind==='caveking'?(heavy?'The Hollow Tyrant slams both coils into the stone. ':'The Hollow Tyrant lunges through the steam. '):e.kind==='frostguard'?(heavy?'The Blizzard Sentinel crashes forward with an ice maul. ':'The Blizzard Sentinel fires a burst of frozen shards. '):e.kind==='krampus'?(heavy?'Krampus unleashes a blizzard hammer swing. ':'Krampus lashes out with frost chains. '):e.turn%3===0?'Scales lashes out with his tail. ':'Scales strikes with his silver saber. ';
 $('battle-log').textContent=(state.guard?'The block fort absorbs most of the blow. ':enemyLine)+`Kyle takes ${hit} damage. `+(isB2&&e.turn%3===2?'CANNON CHARGING! Block Fort will reduce the next hit.':'Your turn!');
 state.guard=false;state.busy=false;tone(147,.14);battleHud();
 if(state.hp<=0){state.mode='defeat';show('battle-ui',false);endScreen(false)}
}
function winBattle(){
 const kind=state.enemy.kind;state.mode='explore';state.busy=false;show('battle-ui',false);show('location');show('objective');show('pause-btn');state.hitText='';state.hitTarget=null;state.fp=state.maxFp;
 if(sound&&score)score.cueVictory();
 tone(392,.1);tone(494,.1,.12);tone(587,.1,.24);tone(784,.3,.36);
 if(kind.startsWith('b2')){Ship.victory(kind);return}
 if(state.chapter===3){Underdeep.victory(kind);return}
 if(state.chapter===4){NorthPole.victory(kind);return}
 if(kind==='droid'){state.droid=true;state.quest=3;state.level=2;state.maxHp=95;state.hp=95;state.acorns+=15;
 say([['Kyle','gray','Checkmate. Well... check-droid.'],['Professor Nutty','squirrel','Splendid! Level two, full health, and fifteen acorns. Cross Oakbridge and stop Scales before his reinforcements arrive.']]);
 }else{state.scales=true;state.quest=4;state.won=true;state.acorns+=30;
 say([['Scales','snake','This is not over! Cobris will hear about this. All six of him!'],['Todd','todd','Good news! I fell on that big lever and raised the drawbridge. The droids can’t follow him back!'],['Professor Nutty','squirrel','The bridge is ours! Kyle, Kenobi... and somehow Todd... Greenwood owes you a great debt.'],['Mortimer Mole','mole','Hooray! I shall celebrate with a particularly squiggly worm.'],['Kyle','gray','Come on, Kenobi. I think our quiet walk just became an adventure.']],()=>{state.mode='victory';endScreen(true)});
 }hud();
}
function endScreen(win){
 show('end-screen');show('location',false);show('objective',false);show('pause-btn',false);
 if(state.chapter===2){Ship.end(win);return}
 if(state.chapter===3){Underdeep.end(win);return}
 if(state.chapter===4){NorthPole.end(win);return}
 $('end-eyebrow').textContent=win?'CHAPTER I COMPLETE':'EVERY HERO GETS BACK UP';
 $('end-title').textContent=win?'Small heroes. A mighty beginning.':'A little rest. Another chance.';
 $('end-copy').textContent=win?`Oakbridge is safe, and you collected ${state.acorns} acorns. But Santa has urgent news: the Corporate Alliance battleship Iron Serpent is targeting Greenwood. Your adventure continues aboard it.`:'Kenobi guides Kyle back to the campfire. Take a breath, restore your courage, and try using Block Fort before a heavy attack.';
 $('end-btn').textContent=win?'Continue to Chapter II →':'Rest & try again →';
}
function resumeWorld(){
 if(state.chapter===1&&state.won){Ship.start(false);return}
 if(state.chapter===2&&state.won){Underdeep.start(false);return}
 if(state.chapter===3&&state.won){NorthPole.start(false);return}
 const won=state.won;state.mode='explore';show('end-screen',false);show('location');show('objective');show('pause-btn');
 if(!won){if(state.chapter===2)Ship.recover();else if(state.chapter===3)Underdeep.recover();else if(state.chapter===4)NorthPole.recover();else{state.hp=state.maxHp;state.fp=state.maxFp;state.p={x:226,y:496,dir:1};state.dog={x:205,y:510};state.snacks=Math.max(state.snacks,2)}}
 hud();canvas.focus();
}
function collides(x,y){
 if(state.chapter===2)return Ship.collides(x,y);
 if(state.chapter===3)return Underdeep.collides(x,y);
 if(state.chapter===4)return NorthPole.collides(x,y);
 if(x<28||x>WORLD.w-28||y<50||y>WORLD.h-25)return true;
 if(x>698&&x<763&&!(y>316&&y<385))return true;
 if(x>145&&x<270&&y>287&&y<357)return true;
 if(x>245&&x<304&&y>379&&y<402)return true;
 if(!state.droid&&x>671&&x<690&&y>302&&y<398)return true;
 return trees.some(t=>Math.abs(x-t.x)<13&&Math.abs(y-t.y)<13);
}
function update(dt){
 clock+=dt;state.flash=Math.max(0,state.flash-dt);state.hitTime=Math.max(0,state.hitTime-dt);
 if(state.mode==='battle'&&state.busy){battleTimer-=dt;if(battleTimer<=0)enemyTurn()}
 if(state.mode!=='explore')return;
 let dx=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0),dy=(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0);
 let len=Math.hypot(dx,dy)||1,speed=95;dx=dx/len*speed*dt;dy=dy/len*speed*dt;
 if(dx)state.p.dir=dx>0?1:-1;
 if(!collides(state.p.x+dx,state.p.y))state.p.x+=dx;
 if(!collides(state.p.x,state.p.y+dy))state.p.y+=dy;
 const dd=Math.hypot(state.p.x-state.dog.x,state.p.y-state.dog.y);
 if(dd>25){state.dog.x+=(state.p.x-state.dog.x)/dd*Math.min(dd-25,speed*dt*1.15);state.dog.y+=(state.p.y-state.dog.y)/dd*Math.min(dd-25,speed*dt*1.15)}
 nearest=availableNPCs().map(n=>({...n,d:Math.hypot(n.x-state.p.x,n.y-state.p.y)})).filter(n=>n.d<48).sort((a,b)=>a.d-b.d)[0]||null;
 show('nearby',!!nearest);if(nearest)$('nearby').innerHTML=`<kbd>E</kbd> ${nearest.name}`;
 $('location-name').textContent=state.chapter===2?Ship.location():state.chapter===3?Underdeep.location():state.chapter===4?NorthPole.location():state.p.x>760?'Oakbridge Outpost':state.p.x>530?'The East Road':'Mossbrook Clearing';
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
function ellipse(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(Math.round(x),Math.round(y),rx,ry,0,0,Math.PI*2);ctx.fill()}
function pathTile(x,y){return (Math.abs(y-350)<27&&x>190&&x<910)||(Math.abs(x-225)<26&&y>330&&y<583)||(Math.abs(y-441)<23&&x>198&&x<460)||(Math.abs(x-465)<23&&y>346&&y<466)||(Math.abs(y-530)<21&&x>220&&x<410)||(Math.abs(x-833)<25&&y>333&&y<433)}
function tree(t){
 let {x,y,size:s}=t;ctx.save();ctx.translate(Math.floor(x),Math.floor(y));ctx.scale(s,s);
 ellipse(1,0,27,9,'#244a37');rect(-8,-37,17,40,'#584f35');rect(-4,-34,5,33,'#80704a');rect(6,-26,4,24,'#3d4731');rect(-12,-4,7,5,'#6b5a37');rect(8,-3,7,5,'#514b31');
 const colors=['#193e32','#27553a','#356b40','#4c7e43','#688f46'];
 [[0,-58,32,21],[-21,-43,22,17],[20,-43,24,18],[-8,-73,23,14]].forEach(([a,b,w,h],i)=>{
  rect(a-w,b-h+7,w*2,h*2-12,colors[0]);rect(a-w+6,b-h,w*2-12,h*2,colors[1]);rect(a-w+5,b-h+5,w*2-14,h*2-13,colors[2]);rect(a-w+9,b-h+4,w*1.15,h-3,colors[3]);rect(a-w+13,b-h+4,w*.6,4,colors[4]);
  for(let j=0;j<15;j++){let px=a-w+rand(j+i*15,x)*w*2,py=b-h+rand(j+i*17,y)*h*1.5;rect(px,py,3+rand(j,x)*5,2,colors[j%5])}
 });ctx.restore();
}
function house(){
 const x=143,y=279;ellipse(209,353,70,14,'#315a38');
 rect(x+12,y+21,116,64,'#8c8258');rect(x+17,y+24,106,55,'#c3bd85');rect(x+22,y+27,96,50,'#dbd09b');
 for(let j=0;j<5;j++)rect(x+16,y+30+j*11,112,2,'#a1a076');
 rect(x+49,y+41,30,44,'#4b503d');rect(x+53,y+45,22,40,'#766143');rect(x+55,y+46,2,37,'#a38a53');rect(x+69,y+65,3,3,'#dfbc69');
 for(let xx of [x+23,x+88]){rect(xx,y+37,19,23,'#5a6450');rect(xx+3,y+40,13,17,'#79b2ac');rect(xx+9,y+40,2,17,'#d4c28a');rect(xx+3,y+48,13,2,'#d4c28a')}
 for(let i=0;i<8;i++){rect(x+64-i*9,y-26+i*6,16+i*18,7,i%2?'#885e3b':'#a87444');rect(x+65-i*9,y-26+i*6,5,6,'#c49454')}
 rect(x+99,y-23,14,23,'#6f7760');rect(x+97,y-26,18,5,'#a3a184');
 rect(x+38,y+85,48,6,'#8e9667');rect(x+35,y+91,54,5,'#a4a977');
}
function burrow(){ellipse(276,395,30,17,'#557542');rect(252,378,47,20,'#78734b');rect(259,371,33,10,'#858050');rect(260,380,31,21,'#263a2c');rect(263,381,25,19,'#192d28');rect(250,397,52,5,'#b49968')}
function chest(x,y){ellipse(x,y,16,5,'#325737');rect(x-13,y-17,26,18,'#664a2e');rect(x-12,y-16,24,7,state.chest?'#3c3427':'#b7803e');rect(x-12,y-6,24,7,'#966335');rect(x-9,y-17,3,18,'#d0aa5c');rect(x+6,y-17,3,18,'#d0aa5c');rect(x-2,y-9,4,5,'#eaca7f')}
function sign(x,y){rect(x-2,y-21,4,23,'#776746');rect(x-17,y-31,34,15,'#af945e');rect(x-14,y-27,26,2,'#635d3e');rect(x+6,y-24,6,2,'#635d3e');rect(x-14,y-21,17,2,'#635d3e')}
function fire(x,y){
 ellipse(x,y,21,10,'#4b5940');for(let i=0;i<7;i++)rect(x+Math.cos(i)*18-4,y+Math.sin(i)*7-4,8,7,i%2?'#859475':'#a3aa8a');
 rect(x-11,y-5,24,5,'#74603d');rect(x-7,y-10,5,15,'#a17f42');const f=Math.floor(clock*7)%3;
 rect(x-7,y-19-f*2,13,18,'#db793d');rect(x-4,y-24+f,7,23,'#efb449');rect(x-2,y-15+f,5,13,'#ffdf83');
}
function marker(x,y){
 let bob=Math.sin(clock*3)*2;rect(x-6,y-48+bob,13,16,'#192f2b');ctx.fillStyle='#f0cf77';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText('!',Math.round(x+.5),Math.round(y-35+bob));
}
function drawMap(){
 if(state.chapter===2){Ship.drawMap();return}
 if(state.chapter===3){Underdeep.drawMap();return}
 if(state.chapter===4){NorthPole.drawMap();return}
 rect(0,0,WORLD.w,WORLD.h,'#547f43');
 for(let y=0;y<WORLD.h;y+=16)for(let x=0;x<WORLD.w;x+=16){
   let r=rand(x,y);
   if(pathTile(x+8,y+8)){rect(x,y,16,16,r>.5?'#b9a66b':'#b3a067');if(r>.55){rect(x+3,y+5,3,2,'#c9b882');rect(x+12,y+13,2,1,'#938e57')}}
   else{if(r>.35)rect(x+2,y+6,3,2,r>.7?'#6a914a':'#416f3d');if(r>.75){rect(x+9,y+3,1,4,'#8eab59');rect(x+7,y+4,1,3,'#7ba053')}if(r>.94){rect(x+4,y+3,2,2,'#e4d891');rect(x+3,y+4,4,1,'#e8e1b1')}}
 }
 rect(692,0,79,WORLD.h,'#a6aa73');rect(698,0,66,WORLD.h,'#3d7971');rect(704,0,54,WORLD.h,'#4a9e94');rect(717,0,25,WORLD.h,'#58ada0');
 for(let y=0;y<WORLD.h;y+=14){let drift=(clock*7+y)%28;rect(706+rand(y)*34,y+drift%14,8+rand(y,2)*10,1,'#93cead');rect(698,y,3,6,'#d0d5a0')}
 for(let y=322;y<382;y+=7){rect(689,y,85,6,'#ac8950');rect(692,y,79,1,'#dbba70');rect(697+rand(y)*30,y,2,6,'#80683e')}
 rect(686,316,91,5,'#695d3e');rect(686,381,91,5,'#695d3e');
 for(let x=688;x<782;x+=29){rect(x,303,5,21,'#886b3f');rect(x-1,300,7,5,'#bca064');rect(x,368,5,20,'#886b3f');rect(x-1,365,7,5,'#bca064')}
 if(!state.droid){rect(673,319,5,70,'#6b5c42');for(let yy=324;yy<385;yy+=12){rect(666,yy,18,5,'#b79b64');rect(666,yy,5,5,'#a3573f')}}
 house();burrow();
 for(let xx=350;xx<508;xx+=23){rect(xx,291,4,17,'#7a7850');rect(xx,295,24,3,'#adb178')}
 rect(820,246,8,52,'#7c785a');rect(828,249,29,26,'#863f36');rect(837,255,10,13,'#d1b067');rect(840,251,4,21,'#d1b067');
 const things=[...trees.map(t=>({...t,kind:'tree'})),...availableNPCs().map(n=>({...n,kind:'npc'})),{...state.p,kind:'player'},{...state.dog,kind:'dog'}].sort((a,b)=>a.y-b.y);
 for(let t of things){
   if(t.kind==='tree')tree(t);
   else if(t.kind==='player'||t.kind==='dog'){ellipse(t.x,t.y-2,t.kind==='player'?10:13,4,'#2e513b77');sprite(t.kind==='player'?'gray':'kenobi',t.x,t.y,2,t.kind==='player'&&state.p.dir<0,(keys.ArrowUp||keys.ArrowDown||keys.ArrowLeft||keys.ArrowRight||keys.KeyW||keys.KeyA||keys.KeyS||keys.KeyD)&&state.mode==='explore'?Math.sin(clock*17):0)}
   else if(t.type==='chest')chest(t.x,t.y);
   else if(t.type==='sign')sign(t.x,t.y);
   else if(t.type==='camp')fire(t.x,t.y);
   else{ellipse(t.x,t.y-1,12,4,'#294f3866');sprite(t.type,t.x,t.y,2,false,Math.sin(clock*2+t.x)*.5);if((t.id==='mole'&&state.quest===0)||(t.id==='professor'&&state.quest===1)||(t.id==='droid'&&state.quest===2)||(t.id==='scales'&&state.quest===3))marker(t.x,t.y)}
 }
 for(let i=0;i<16;i++){let x=(i*127+Math.sin(clock*.5+i)*22)%WORLD.w,y=(i*57+clock*4)%WORLD.h;rect(x,y,2,1,i%3?'#e0d89088':'#e8d184bb')}
}
function drawBattle(){
 if(state.chapter===2){Ship.drawBattle();return}
 if(state.chapter===3){Underdeep.drawBattle();return}
 if(state.chapter===4){NorthPole.drawBattle();return}
 const W=canvas.width,H=canvas.height;
 rect(0,0,W,H,'#305641');
 for(let y=0;y<H;y+=12)for(let x=0;x<W;x+=16){let r=rand(x,y);rect(x,y,16,12,r>.5?'#375f44':'#3c6746');if(r>.65)rect(x+4,y+7,4,2,'#5e814c')}
 rect(0,H*.30,W,H*.35,'#81925c');
 for(let y=H*.3;y<H*.66;y+=10)for(let x=0;x<W;x+=13)if(rand(x,y)>.55)rect(x,y,4,2,'#94a267');
 for(let x=0;x<W+60;x+=56)tree({x,y:100+(x%3)*10,size:1.5});
 tree({x:8,y:H*.58,size:1.6});tree({x:W-3,y:H*.59,size:1.6});
 let mid=H<500?H*.56:H*.44;
 ellipse(W*.27,mid,54,12,'#2c4e3b55');ellipse(W*.71,mid-8,48,12,'#2c4e3b55');
 sprite('gray',W*.25,mid,3.5,false,Math.sin(clock*3));sprite('kenobi',W*.34,mid+29,3,false,Math.sin(clock*4));
 sprite(state.enemy.kind==='droid'?'droid':'snake',W*.73,mid-4,state.enemy.kind==='droid'?4:4.5,true,Math.sin(clock*2));
 if(state.guard){for(let i=0;i<3;i++){rect(W*.4,mid-42+i*16,18,15,'#8d9d86');rect(W*.4+2,mid-40+i*16,14,3,'#c4c9a6')}}
 if(state.enemy.kind==='scales')sprite('todd',W*.88,mid-35,2.5,false,Math.sin(clock*4)*2);
 if(state.hitTime>0){ctx.font='bold 23px monospace';ctx.textAlign='center';ctx.fillStyle=state.hitTarget==='gray'?'#ffbd94':'#fff0ab';ctx.strokeStyle='#1b362b';ctx.lineWidth=3;let x=state.hitTarget==='gray'?W*.25:W*.73,y=mid-70-(1-state.hitTime)*15;ctx.strokeText(state.hitText,x,y);ctx.fillText(state.hitText,x,y)}
 if(state.flash>0){rect(0,0,W,H,'#fff0cc22');state.hitTarget=null}
}
function render(){
 ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,canvas.width,canvas.height);
 if(state.mode==='battle'||(state.mode==='modal'&&modalReturn==='battle'))drawBattle();
 else{let camX=clamp(state.p.x-canvas.width*.46,0,Math.max(0,WORLD.w-canvas.width)),camY=clamp(state.p.y-canvas.height*.55,0,Math.max(0,WORLD.h-canvas.height));ctx.save();ctx.translate(-Math.floor(camX),-Math.floor(camY));drawMap();ctx.restore()}
}
const cast=[
 ['Kyle','gray','A kid with a fencer’s courage, a chess player’s mind, and a Minecraft builder’s imagination. The hero of our story.'],
 ['Kenobi','kenobi','Kyle’s pet dog, faithful companion, and enthusiastic battle partner. The best boy in Greenwood.'],
 ['Mortimer Mole','mole','A very nervous mole who lives underground, wears thick glasses, and loves squiggly worms. Seeing danger is difficult. Worrying about it is not.'],
 ['Professor Nutty & the Nut Brigade','squirrel','An armored collective of squirrels led by Professor Nutty. Courageous defenders, tactical thinkers, and professional acorn throwers.'],
 ['Todd','todd','The king and queen’s accident-prone son. Constantly in trouble, constantly saving the day, almost never on purpose.'],
 ['Gilgamesh','wizard','A wizard who watches over Todd. A full-time job with substantial overtime.'],
 ['Hilgamesh','hil','Gilgamesh’s cousin and fellow wizard. Also looks after Todd. Two wizards are apparently the minimum.'],
 ['Dumbledore','beard','A large, hulking, bearded man who helps Gilgamesh and Hilgamesh. A gentle heart and very useful shoulders.'],
 ['Santa & the Daddy Republic','santa','Santa leads the Christmas elves against the Corporate Alliance. Warm hearts, brave defenders, excellent logistics.'],
 ['Cobris','cobris','The turquoise, six-headed snake king who leads the Corporate Alliance. One world. Six heads. Far too many opinions about conquering it.'],
 ['Scales','snake','Cobris’s blue-scaled right-hand man: an anthropomorphic snake, calculating commander, and the first chapter’s formidable opponent.'],
 ['The Corporate Alliance','droid','An army of droids and snakes that wants to rule the world. Greenwood is merely the next name on its list.'],
 ['B2 Heavy Droids','b2','Broad-shouldered, gunmetal-armored battle droids aboard the Iron Serpent. Their wrist blasters build up to a powerful charged shot. A block fort is a very good idea.'],
 ['BULWARK','b2captain','The battleship’s B2 commander, marked by gold shoulder stripes. Heavy armor, a heavy cannon, and absolutely no idea what to do about Kenobi.'],
 ['Holly','santa','A Daddy Republic scout captured aboard the Iron Serpent. Her knowledge of the chess-coded targeting system could save Greenwood.']
];
function openModal(type){
 if(state.mode==='modal'){closeModal();return}modalReturn=state.mode;state.mode='modal';Object.keys(keys).forEach(k=>keys[k]=false);show('modal-backdrop');show('book-tabs',type==='book');
 if(type==='book'){$('modal-title').textContent='The storybook';bookTab('quest')}
 else if(type==='pause'){$('modal-title').textContent='Take a little breather.';$('book-content').innerHTML='<p>Kyle and Kenobi will be right here. Your adventure is paused.</p><p>Progress lasts until this page is refreshed.</p><button class="resume-button" id="resume-btn">Return to adventure</button>';$('resume-btn').onclick=closeModal}
 else{$('modal-title').textContent='A field guide to adventure';$('book-content').innerHTML=`<h3>${state.chapter===2?'Explore the Iron Serpent':state.chapter===3?'Explore the Underdeep Caverns':state.chapter===4?'Explore the North Pole Citadel':'Explore Greenwood'}</h3><p><kbd>W A S D</kbd> or arrow keys to move. <kbd>E</kbd> or <kbd>Space</kbd> to talk, read, collect, or rest. On a phone, use the direction pad and Interact button.</p><h3>Follow the golden marker</h3><p>${state.chapter===2?'Hear Santa’s transmission in the hangar. Rescue the scout, disable the targeting relays, then reach the command bridge.':state.chapter===3?'Find Mortimer underground, power the crystal gate, and stop the Hollow Tyrant in the magma vault.':state.chapter===4?'Find Santa in the snowfield, restore three aurora beacons, then stop Krampus at the polar forge.':'Start with Mortimer near his burrow. Professor Nutty will help you plan your next move.'} Walk close to a character or console, then interact.</p><h3>Think before you strike</h3><p>Battles wait for you. Use the four buttons or keys 1–4. Fencing is free. Knight’s Gambit costs 3 focus. Block Fort reduces the next hit and restores 2 focus. Snacks restore health. Kenobi automatically assists every attack.${state.chapter===2?' B2 droids charge their cannon every third turn. Watch for the warning and block the next shot.':state.chapter===3?' Burrow beasts hit hardest every third turn, so timing your block fort matters.':state.chapter===4?' Frost elites slam hardest every third turn. Keep enough focus to fortify before heavy hits.':''}</p><h3>Rest and regroup</h3><p>${state.chapter===2?'The hangar medical station restores health and focus. Losing brings you back there without resetting your mission.':state.chapter===3?'The forge camp restores health and focus. Losing returns you there while keeping mission progress.':state.chapter===4?'The warming lodge restores health and focus. Losing returns you there while keeping beacon progress.':'The campfire restores health and focus. Losing a battle takes you safely back to camp.'} Press <kbd>J</kbd> for your storybook or <kbd>Esc</kbd> to pause. Sound starts only if you enable it.</p>`}
 $('modal-close').focus();
}
function closeModal(){show('modal-backdrop',false);state.mode=modalReturn;canvas.focus()}
function bookTab(tab){
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 if(tab==='quest'&&state.chapter===2){$('book-content').innerHTML=Ship.questHTML();return}
 if(tab==='quest'&&state.chapter===3){$('book-content').innerHTML=Underdeep.questHTML();return}
 if(tab==='quest'&&state.chapter===4){$('book-content').innerHTML=NorthPole.questHTML();return}
 if(tab==='quest'){
 const steps=['Speak to Mortimer at his burrow.','Meet Professor Nutty along the east path.','Defeat the Alliance Sentry at Oakbridge.','Cross the bridge and defeat Scales.'];
 $('book-content').innerHTML='<span class="eyebrow">CHAPTER I</span><h3>The Acorn Accord</h3><p>A frightened mole. A stolen bridge. An unlikely alliance.</p>'+steps.map((s,i)=>`<div class="quest-step ${state.quest>i?'done':''}"><span>${state.quest>i?'✓':state.quest===i?'◇':'○'}</span><div>${s}</div></div>`).join('')+'<h3>Supplies & helpful places</h3><p>Find the supply chest east of Mortimer for extra snacks. The campfire south of the cottage restores health and focus. Talk to the wizards, the Republic scout, and Todd along the way.</p>';
 }else if(tab==='cast')$('book-content').innerHTML=cast.map(([n,t,d])=>`<article class="character-row"><img src="${sprites[t].toDataURL()}" alt=""><div><h3>${n}</h3><p>${d}</p></div></article>`).join('');
 else $('book-content').innerHTML='<h3>A little corner of a much bigger world</h3><p>Greenwood is home to mossy burrows, winding streams, and the Nut Brigade. Oakbridge connects its peaceful clearing to the road beyond.</p><h3>The Corporate Alliance</h3><p>Cobris, the turquoise six-headed snake king, commands an army of droids and snakes. His blue lieutenant Scales came to claim the bridge.</p><h3>The Iron Serpent</h3><p>The Alliance battleship hangs above Greenwood. A stolen shuttle reaches its hangar. Beyond the heavy bulkheads lie engineering, the brig, a chess-coded targeting core, and BULWARK’s command bridge. Armored B2 droids patrol its decks.</p><h3>The Daddy Republic</h3><p>Santa’s Christmas elves stand against the Alliance. Holly, a captured scout, knows how to disable the battleship’s weapons without harming its crew.</p><h3>Beyond the battleship</h3><p>The royal court, the Republic’s workshops, and Cobris’s stronghold await future adventures.</p>';
}
let audio=null,sound=false,score=null;
function tone(freq,duration=.1,delay=0,volume=.028){
 if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.value=freq;o.connect(g);g.connect(score?score.effects:audio.destination);
 const t=audio.currentTime+delay;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.01);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.start(t);o.stop(t+duration+.02);
 o.onended=()=>{o.disconnect();g.disconnect()};
}
async function toggleSound(){
 const button=$('sound-btn');if(button.disabled)return;button.disabled=true;
 try{
   if(sound){sound=false;if(score)score.stop();if(audio)await audio.suspend()}
   else{
     audio=audio||new(window.AudioContext||window.webkitAudioContext)();await audio.resume();
     if(audio.state!=='running')throw new Error('Audio is waiting for browser permission');
     score=score||new AdventureScore(audio,()=>({mode:state.mode==='modal'?modalReturn:state.mode,paused:state.mode==='modal',chapter:state.chapter,enemy:state.enemy?.kind}));
     sound=true;score.start();
   }
   button.title=sound?'Music changes automatically for exploration, battles, and bosses. Click to mute.':'Turn on music and sound effects';
 }catch(error){sound=false;if(score)score.stop();button.title='Audio could not start. Tap again or open the game in a browser.';console.warn('Audio startup:',error.message)}
 finally{button.textContent=sound?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(sound));button.disabled=false}
}
window.get_music_state=()=>score?score.status():{enabled:false,track:null,bpm:0};
function keydown(e){
 if(e.code==='Tab'&&state.mode==='modal'){const f=[...$('modal-backdrop').querySelectorAll('button:not([disabled])')].filter(el=>el.offsetParent!==null),first=f[0],end=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus()}else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus()}return}
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&state.mode!=='modal')e.preventDefault();
 if(e.repeat){keys[e.code]=true;return}
 keys[e.code]=true;
 if(e.code==='Escape'){state.mode==='modal'?closeModal():state.mode!=='title'&&openModal('pause');return}
 if(e.code==='KeyJ'){openModal('book');return}
 if(e.key==='?'){openModal('help');return}
 if(state.mode==='title'&&e.code==='Enter'){e.preventDefault();start();return}
 if(state.mode==='battle'&&/^Digit[1-4]$/.test(e.code)){action(['lunge','chess','build','snack'][+e.code.slice(-1)-1]);return}
 if(['KeyE','Space','Enter'].includes(e.code)&&state.mode!=='modal'&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();interact()}
}
initSprites();fresh();hud();
$('start-btn').onclick=start;$('dialog-next').onclick=nextLine;$('journal-btn').onclick=()=>openModal('book');$('help-btn').onclick=()=>openModal('help');$('pause-btn').onclick=()=>openModal('pause');$('modal-close').onclick=closeModal;$('sound-btn').onclick=toggleSound;$('end-btn').onclick=resumeWorld;$('touch-interact').onclick=interact;
$('chapter2-btn').onclick=()=>Ship.start(true);$('board-btn').onclick=()=>{if(state.chapter===2)Ship.board();else if(state.chapter===3)Underdeep.board();else if(state.chapter===4)NorthPole.board();};
$('chapter3-btn').onclick=()=>Underdeep.start(true);
$('chapter4-btn').onclick=()=>NorthPole.start(true);
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>bookTab(b.dataset.tab));
document.querySelectorAll('[data-dir]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys[b.dataset.dir]=true};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys[b.dataset.dir]=false});
window.addEventListener('keydown',keydown);window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>Object.keys(keys).forEach(k=>keys[k]=false));
$('modal-backdrop').onclick=e=>{if(e.target===$('modal-backdrop'))closeModal()};
new ResizeObserver(()=>{const r=$('stage').getBoundingClientRect();canvas.width=r.width<600?480:640;canvas.height=Math.round(canvas.width*r.height/r.width);render()}).observe($('stage'));
function loop(t){let dt=Math.min((t-last)/1000,.05);last=t;update(dt);render();frameCount++;if(t-fpsLast>1000){fps=Math.round(frameCount*1000/(t-fpsLast));$('perf').textContent=`${fps} FPS`;frameCount=0;fpsLast=t}requestAnimationFrame(loop)}requestAnimationFrame(loop);
window.advanceTime=ms=>{for(let i=0;i<Math.ceil(ms/16.667);i++)update(1/60);render()};
window.render_game_to_text=()=>JSON.stringify({mode:state.mode,chapter:state.chapter,coordinates:'world pixels; origin top-left, x right, y down',player:{x:Math.round(state.p.x),y:Math.round(state.p.y)},dog:{x:Math.round(state.dog.x),y:Math.round(state.dog.y)},hp:state.hp,maxHp:state.maxHp,focus:state.fp,snacks:state.snacks,acorns:state.acorns,level:state.level,quest:state.quest,objective:questTitle(),nearby:nearest?.id||null,dialog:state.mode==='dialog'?$('dialog-text').textContent:null,enemy:state.mode==='battle'?state.enemy:null,busy:state.busy,droidDefeated:state.droid,scalesDefeated:state.scales,won:state.won,ship:state.ship||null,cave:state.cave||null,pole:state.pole||null,entities:availableNPCs().map(({id,x,y})=>({id,x,y})),obstacles:state.chapter===2?'Walkable hull x62–964/y140–606. Bulkheads x333–363 and x685–715 have doors at y325–391. First unlocks after sentry; second after relays. Reactor x477–568/y150–268; brig wall x473–579/y437–483; shuttle x91–199/y283–334.':state.chapter===3?'Walkable cavern x68–956/y118–620. Crystal gate x470–540 blocks passage until energized. Magma pit x688–864/y248–452 and collapsed wall x274–364/y248–404 are blocked terrain.':state.chapter===4?'Walkable icefield x72–950/y112–622. Frozen gate x452–548 stays closed until all beacons are lit. Glacier crevasse x350–520/y252–430 and forge wall x700–760 with a center doorway are blocked terrain.':'Cottage x145–270/y287–357; stream x698–763, bridge y316–385; sentry gate x671–690 until sentry defeated; trees around clearing edges'});
