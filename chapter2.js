'use strict';
// Chapter data, rules, and rendering share the main game's input and combat engine.
const Ship={
  title:'The Iron Serpent',
  relayOrder:['B1','C3','D1'],
  nodes:[
    {id:'shuttle',name:'Escape shuttle',type:'shuttle',x:145,y:359},
    {id:'radio',name:'Santa’s transmission',type:'radio',x:139,y:447},
    {id:'todd2',name:'Todd, unexpected stowaway',type:'todd',x:251,y:430},
    {id:'medbay',name:'Medical station · restore HP & focus',type:'medbay',x:165,y:573},
    {id:'supply2',name:'Emergency rations',type:'supply',x:273,y:555},
    {id:'deckguard',name:'B2 Heavy Sentry',type:'b2',x:319,y:358},
    {id:'scout',name:'Imprisoned Republic scout',type:'santa',x:527,y:514},
    {id:'schematic',name:'Targeting schematic',type:'terminal',x:422,y:275},
    {id:'relay-B1',name:'Relay B1 · SHIELD',type:'relay',label:'B1',x:420,y:183},
    {id:'relay-C3',name:'Relay C3 · DRIVE',type:'relay',label:'C3',x:618,y:183},
    {id:'relay-D1',name:'Relay D1 · TARGETING',type:'relay',label:'D1',x:618,y:287},
    {id:'captain',name:'B2 Commander BULWARK',type:'b2captain',x:841,y:354},
    {id:'holo',name:'Cobris’s command projector',type:'holo',x:846,y:203},
    {id:'bridge-cache',name:'Officer’s ration locker',type:'supply',x:922,y:494}
  ],
  goals:[
    'Hear Santa’s transmission in the hangar',
    'Defeat the B2 sentry at the east bulkhead',
    'Free the scout in the engineering brig',
    'Disable relays: B1 → C3 → D1',
    'Enter the bridge and defeat BULWARK',
    'Return west to the escape shuttle',
    'Mission complete. Greenwood is safe.'
  ],
  makeSprites(){
    const make=commander=>{
      const c=document.createElement('canvas');c.width=32;c.height=32;const g=c.getContext('2d');
      const f=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
      const shadow='#293743',dark='#425465',base=commander?'#7b8993':'#6d8291',light='#a1b5bb',edge='#c2cdd0',red='#f07853';
      f(12,1,8,6,shadow);f(13,2,6,3,dark);f(14,3,4,1,red);
      f(5,4,22,12,shadow);f(2,6,28,6,shadow);
      f(5,5,8,8,base);f(19,5,8,8,base);f(3,7,5,5,base);f(24,7,5,5,base);
      f(5,5,7,2,light);f(21,5,6,2,light);f(12,6,8,11,dark);
      f(10,8,12,9,base);f(10,8,3,7,light);f(13,8,7,2,light);f(17,10,2,2,red);
      f(10,16,12,3,shadow);f(12,17,8,3,dark);f(12,18,8,1,light);
      f(2,12,6,9,dark);f(3,12,4,7,base);f(3,12,1,6,light);
      f(24,12,7,10,shadow);f(24,12,6,8,base);f(25,13,4,2,light);f(26,18,5,4,dark);f(27,21,3,2,shadow);
      f(2,20,6,3,shadow);f(3,20,4,2,light);f(27,18,3,1,red);
      f(10,19,12,4,shadow);f(11,19,10,3,base);
      for(const x of [9,19]){f(x,22,5,7,dark);f(x,22,4,3,base);f(x,25,5,2,shadow);f(x+1,27,4,3,base);f(x-1,30,7,2,shadow);f(x,30,5,1,light)}
      if(commander){f(5,6,6,2,'#d7aa58');f(21,6,6,2,'#d7aa58');f(14,11,3,4,'#d7aa58');f(15,12,1,2,edge)}
      return c;
    };
    sprites.b2=make(false);sprites.b2captain=make(true);
  },
  start(quick=false){
    if(quick){fresh();state.level=2;state.maxHp=95;state.hp=95;state.acorns=30;state.snacks=3;state.droid=true;state.scales=true}
    state.chapter=2;state.quest=0;state.won=false;state.enemy=null;state.busy=false;state.guard=false;state.hitTime=0;state.flash=0;
    state.ship={briefed:false,guard:false,freed:false,relays:[],captain:false,supplies:false,cache:false,escaped:false};
    state.p={x:160,y:492,dir:1};state.dog={x:136,y:510};state.hp=state.maxHp;state.fp=state.maxFp;state.snacks+=3;
    nearest=null;dialogQueue=[];afterDialog=null;Object.keys(keys).forEach(k=>keys[k]=false);
    state.mode='chapterIntro';Ship.theme();
    ['title-screen','end-screen','dialog','battle-ui','location','objective','pause-btn','nearby'].forEach(id=>show(id,false));
    show('chapter-intro');$('boarding-note').textContent=quick?'Chapter II quick start · Level 2 · Fresh supplies':'Party progress carried forward · Santa added 3 trail snacks';
    hud();$('board-btn').focus();
  },
  theme(){
    document.body.dataset.chapter='2';$('chapter-label').textContent='CHAPTER II · THE IRON SERPENT';
    document.querySelector('#location small').textContent='CORPORATE ALLIANCE BATTLESHIP';
    $('location-name').textContent=Ship.location();
    document.querySelector('.chapter-note h2').textContent='A little courage. A very large ship.';
    document.querySelector('.chapter-note p').textContent='The Iron Serpent has locked its cannons on Greenwood. A captured scout, a chess-coded targeting system, and an army of heavy B2 droids stand between Kyle and the bridge. Fortunately, Kenobi came along. Unfortunately, so did Todd.';
    document.title='The Kyle Chronicles · The Iron Serpent';
  },
  board(){
    show('chapter-intro',false);state.mode='explore';show('location');show('objective');show('pause-btn');
    say([['Kyle','gray','Santa lent us a captured shuttle. We snuck into a Corporate Alliance battleship. This is officially not a quiet walk.'],['Kenobi','kenobi','[Kenobi sniffs the cold metal deck. Something very large clanks beyond the bulkhead.]'],['Todd','todd','Surprise! I thought this was the carriage home. Do all carriages have emergency eject buttons?'],['Kyle','gray','Todd. Do not press anything. Santa’s transmission is on that amber console just north of us.']]);
  },
  entities(){return Ship.nodes.filter(n=>!(n.id==='deckguard'&&state.ship.guard)&&!(n.id==='captain'&&state.ship.captain))},
  goal(){return Ship.goals[state.quest]},
  location(){return state.p.x>704?'Command Bridge':state.p.x>348?'Engineering & Brig':'Hangar Bay 07'},
  collides(x,y){
    if(x<62||x>964||y<140||y>606)return true;
    if(x>333&&x<363&&(!(y>325&&y<391)||!state.ship.guard))return true;
    if(x>685&&x<715&&(!(y>325&&y<391)||state.ship.relays.length!==3))return true;
    if(x>477&&x<568&&y>150&&y<268)return true;
    if(x>473&&x<579&&y>437&&y<483)return true;
    if(x>91&&x<199&&y>283&&y<334)return true;
    return false;
  },
  interact(n){
    const s=state.ship;
    if(n.id==='radio'){
      if(!s.briefed)say([['Santa','santa','Kyle, the Iron Serpent is preparing to fire on Greenwood. We must stop it without hurting anyone aboard.'],['Santa','santa','A heavy B2 sentry guards the east bulkhead. Defeat it, take its keycard, and rescue our scout in engineering. She knows the targeting system.'],['Professor Nutty','squirrel','These droids are tougher than the skinny ones! When their arm cannon charges, build your block fort.'],['Mortimer Mole','mole','I will provide... um... extremely nervous moral support. From somewhere that is not a battleship.']],()=>{s.briefed=true;state.quest=1});
      else say([['Santa','santa',s.captain?'The cannons are silent! Return to the shuttle in the west hangar. Everyone is counting on you.':'Find the scout after defeating the B2 sentry. The medical station south of the shuttle restores health and focus.']]);
    }else if(n.id==='deckguard'){
      if(!s.briefed)say([['Kyle','gray','That is a LOT of armor. Better hear Santa’s plan at the hangar console before we pick a fight.']]);
      else say([['B2 Heavy Sentry','b2','UNAUTHORIZED ORGANIC LIFE. ONE HUMAN. ONE CANINE. ONE... PRINCE IN A STORAGE CRATE.'],['Kyle','gray','Todd, stay put. Kenobi, watch for the cannon charging.']],()=>beginBattle('b2'));
    }else if(n.id==='medbay'){
      say([['Medical station','b2','ALLIANCE FIRST AID. PATIENT SPECIES: BRAVE KID. BONUS PATIENT: GOOD DOG.'],['Kyle','gray','Full health and focus restored. Even evil battleships have decent first aid.']],()=>{state.hp=state.maxHp;state.fp=state.maxFp});
    }else if(n.id==='supply2'||n.id==='bridge-cache'){
      const key=n.id==='supply2'?'supplies':'cache';
      if(s[key])say([['Kyle','gray','We already packed the supplies from this locker.']]);
      else say([['Kenobi','kenobi','[Kenobi finds three trail snacks and ten acorns. Why does a battleship have acorns? Best not to ask.]']],()=>{s[key]=true;state.snacks+=3;state.acorns+=10;tone(660,.16)});
    }else if(n.id==='scout'){
      if(!s.guard)say([['Republic scout','santa','The B2 sentry has my keycard. I knew I should have disguised myself as a taller elf.']]);
      else if(!s.freed)say([['Republic scout','santa','The keycard! Thank you. I am Holly, Daddy Republic intelligence. Very festive. Very classified.'],['Holly','santa','The targeting relays use a chess knight’s route: B1, then C3, then D1. Activate those three consoles in that order.'],['Kyle','gray','Two squares, then one. I know this game.'],['Holly','santa','B1 is northwest of the reactor. C3 is northeast. D1 is southeast. A wrong move resets the sequence, but you can try again.']],()=>{s.freed=true;state.quest=3;state.acorns+=10});
      else say([['Holly','santa',s.captain?'I will get the crew to safety. You and Kenobi get back to your shuttle!':'The knight’s route is B1 → C3 → D1. Check the schematic southwest of the reactor if you need a reminder.']]);
    }else if(n.id==='schematic'){
      say([['Targeting schematic','droid','SECURITY ROUTE: B1 → C3 → D1. Shield relay: northwest. Drive relay: northeast. Targeting relay: southeast.'],['Kyle','gray',s.freed?'The same route Holly gave us. A chess puzzle on a battleship. Finally, homework I can use.':'First we should free the scout in the brig south of here. She can make sure this shuts down the weapons safely.']]);
    }else if(n.type==='relay'){
      if(!s.freed){say([['Kyle','gray','Let’s rescue the scout first. I do not want to switch off the air by mistake.']]);return}
      if(s.relays.length===3){say([['Targeting console','droid','WEAPONS DISABLED. BRIDGE ACCESS GRANTED. THIS IS NOT COVERED BY YOUR WARRANTY.']]);return}
      const expected=Ship.relayOrder[s.relays.length];
      if(n.label!==expected){s.relays=[];say([['Targeting console','droid','INCORRECT KNIGHT MOVE. RELAY SEQUENCE RESET.'],['Kyle','gray','No harm done. B1, then C3, then D1. Let’s try again.']]);tone(160,.15);return}
      s.relays.push(n.label);tone(440+s.relays.length*110,.15);
      if(s.relays.length===3)say([['Targeting system','droid','CANNON TARGET LOCK REMOVED. BRIDGE BULKHEAD OPEN.'],['Professor Nutty','squirrel','Excellent! The B2 commander can still override the shutdown. Reach the bridge to the east and stop him!']],()=>{state.quest=4;state.acorns+=15});
      else say([['Targeting console','droid',`RELAY ${n.label} OFFLINE. ${s.relays.length} OF 3. NEXT: ${Ship.relayOrder[s.relays.length]}.`]]);
    }else if(n.id==='captain'){
      if(s.relays.length<3){say([['BULWARK','b2captain','BRIDGE ACCESS DENIED. I HAVE MORE ARMOR THAN YOU HAVE PLANS.']]);return}
      say([['BULWARK','b2captain','I AM BULWARK. I DO NOT TRIP. I DO NOT MISS. I DO NOT UNDERSTAND THE DOG.'],['Kenobi','kenobi','Woof. [Kenobi considers this a tactical advantage.]'],['Kyle','gray','Your cannons are offline. Let’s keep them that way.']],()=>beginBattle('b2captain'));
    }else if(n.id==='holo'){
      say([['Cobris','cobris',s.captain?'Six heads. Six plans. And somehow ONE CHILD keeps getting in the way!':'[A turquoise, six-headed hologram flickers above the projector.] Scales, prepare the fleet. Greenwood was only the beginning.']]);
    }else if(n.id==='todd2'){
      say([['Todd','todd',s.captain?'I tripped over a cable and opened every cargo door. That is good, right?':'I am keeping my hands in my pockets. Gilgamesh and Hilgamesh would be proud. They would also ask why I am in space.']]);
    }else if(n.id==='shuttle'){
      if(!s.captain)say([['Kyle','gray','Our way home. We cannot leave while Greenwood is still in danger.']]);
      else if(!s.escaped)say([['Todd','todd','I found the seat belts! And possibly the landing gear. Sorry about the landing gear.'],['Holly','santa','All hands are safely clear. The Iron Serpent cannot fire. Get home, heroes!'],['Kyle','gray','Mission accomplished. Kenobi, you can have the window seat.'],['Kenobi','kenobi','WOOF!']],()=>{s.escaped=true;state.quest=6;state.won=true;state.mode='victory';endScreen(true)});
      else say([['Kyle','gray','This deck is safe to explore now. What an adventure, Kenobi.']]);
    }
  },
  victory(kind){
    const s=state.ship;
    if(kind==='b2'){
      s.guard=true;state.quest=2;state.level=3;state.maxHp=110;state.maxFp=8;state.hp=110;state.fp=8;state.acorns+=20;
      say([['B2 Heavy Sentry','b2','POWERING DOWN. REQUESTING... A SMALLER DOG.'],['Kyle','gray','A keycard! And level three. Full health, eight focus, and a way into engineering.'],['Professor Nutty','squirrel','The brig is south of the reactor. Get our scout out, recruit!']]);
    }else{
      s.captain=true;state.quest=5;state.acorns+=40;state.fp=state.maxFp;
      say([['BULWARK','b2captain','COMMAND OVERRIDE... FAILED. DOG... STILL NOT UNDERSTOOD.'],['Cobris','cobris','[All six turquoise heads fill the bridge hologram.] You again? Scales said you were a minor inconvenience!'],['Kyle','gray','Tell Scales we got promoted.'],['Todd','todd','I tripped over a cable. Now all the drone launch doors are open. Is that bad?'],['Holly','santa','The attack drones drifted straight into the ship’s own recovery nets. Todd, you just grounded the whole fleet!'],['Professor Nutty','squirrel','Kyle! Take Kenobi and Todd back to the shuttle in the west hangar. The weapons are safe. Time to go home.']]);
    }hud();
  },
  end(win){
    $('end-eyebrow').textContent=win?'CHAPTER II COMPLETE':'REGROUP AT THE MEDICAL STATION';
    $('end-title').textContent=win?'Big ship. Bigger hearts.':'Bent, but not beaten.';
    $('end-copy').textContent=win?`The scout is free, Greenwood is safe, and the Iron Serpent’s guns are silent. ${state.acorns} acorns collected across your adventure. Cobris is going to need a seventh opinion.`:'Kenobi brings Kyle to the hangar’s medical station. Your mission progress is safe. Watch for the charged-cannon warning and use Block Fort before the next shot.';
    $('end-btn').textContent=win?'Explore the secured ship →':'Recover & try again →';
  },
  recover(){
    state.hp=state.maxHp;state.fp=state.maxFp;state.snacks=Math.max(state.snacks,3);state.p={x:166,y:543,dir:1};state.dog={x:143,y:552};state.busy=false;state.hitTime=0;nearest=null;
  },
  questHTML(){
    const steps=['Hear Santa’s briefing in the hangar.','Defeat the B2 sentry and take its keycard.','Free Holly, the scout in the brig.','Disable B1, C3, then D1 to open the bridge.','Defeat B2 Commander BULWARK.','Return to the shuttle in the west hangar.'];
    return '<span class="eyebrow">CHAPTER II</span><h3>The Iron Serpent</h3><p>Infiltrate the Corporate Alliance battleship. Stop its weapons. Bring everyone home.</p>'+steps.map((t,i)=>`<div class="quest-step ${state.quest>i?'done':''}"><span>${state.quest>i?'✓':state.quest===i?'◇':'○'}</span><div>${t}</div></div>`).join('')+`<h3>Relay status</h3><p>${state.ship.relays.length?state.ship.relays.join(' → '):'No relays disabled.'} · ${state.ship.relays.length}/3</p><h3>Your route</h3><p>WEST: shuttle, Santa’s radio, medical station, supplies. CENTER: reactor, three relays, scout’s brig. EAST: command bridge and BULWARK.</p><h3>B2 tactics</h3><p>Heavy droids charge their arm cannon every third turn. Watch for the warning, then build a block fort. Rest at the hangar medical station anytime. Losing keeps your mission progress.</p>`;
  },
  label(text,x,y,color='#b8c9d0',size=10){
    ctx.fillStyle=color;ctx.font=`${size}px monospace`;ctx.textAlign='center';ctx.fillText(text,Math.round(x),Math.round(y));
  },
  stars(x,y,w,h){
    rect(x,y,w,h,'#0c2035');
    for(let i=0;i<65;i++)rect(x+rand(i,3)*w,y+rand(i,7)*h,i%5===0?2:1,1,i%4===0?'#a9d6e0':'#526d8b');
  },
  panel(x,y,w=28,h=24,lit='#6bc6d2'){
    rect(x-w/2-3,y-h-3,w+6,h+6,'#1c2d40');rect(x-w/2,y-h,w,h,'#8498a4');rect(x-w/2+2,y-h+2,w-4,h-7,'#20384d');rect(x-w/2+5,y-h+5,w-10,2,lit);rect(x-w/2+5,y-h+10,(w-10)*.6,1,lit);rect(x-w/2+3,y-4,3,2,'#d5ad64');rect(x+w/2-7,y-4,4,2,lit);
  },
  drawMap(){
    const s=state.ship;Ship.stars(0,0,WORLD.w,WORLD.h);
    ellipse(875,55,145,64,'#234d6e');ellipse(859,39,118,42,'#487f97');rect(786,25,68,8,'#76a5aa');rect(847,56,88,6,'#608b80');
    rect(34,109,952,523,'#15273c');rect(42,117,936,507,'#637485');
    for(let y=122;y<616;y+=24)for(let x=48;x<974;x+=24){
      let c=(Math.floor(x/24)+Math.floor(y/24))%2?'#506171':'#546676';rect(x,y,23,23,c);rect(x+2,y+2,20,1,'#637586');rect(x+3,y+20,2,1,'#3d4e60');
    }
    // Painted route lines and recessed cable tracks.
    for(let y of [323,390]){rect(54,y,914,3,'#273e53');for(let x=60;x<969;x+=22)rect(x,y+1,13,1,'#9ca9a6')}
    for(let x=58;x<963;x+=20){rect(x,135,12,4,'#d0a452');rect(x,601,12,4,'#d0a452')}
    for(let y=152;y<600;y+=44){rect(48,y,4,19,'#88b5c5');rect(974,y,4,19,'#88b5c5')}
    // Hull windows, ribs and conduits.
    for(const [x,w] of [[61,259],[379,289],[732,219]]){
      rect(x-5,40,w+10,90,'#20364b');Ship.stars(x,44,w,70);rect(x,119,w,8,'#879ba4');
      for(let xx=x;xx<x+w;xx+=65){rect(xx,43,5,78,'#536c80');rect(xx+1,48,1,64,'#91aebb')}
      rect(x,114,w,3,'#d2a25c');
    }
    for(const x of [339,691]){
      rect(x-9,117,30,208,'#24394e');rect(x-9,391,30,232,'#24394e');
      rect(x-7,117,6,207,'#93a1a8');rect(x-7,391,6,231,'#93a1a8');
      for(let y=130;y<617;y+=27)if(y<317||y>390){rect(x+1,y,16,3,'#52697c');rect(x+13,y+5,3,10,'#be9050')}
      const open=x===339?s.guard:s.relays.length===3;
      if(!open){rect(x-8,325,29,66,'#24364a');rect(x-3,329,18,58,'#8b9290');rect(x+4,329,2,58,'#d2a557');for(let yy=333;yy<386;yy+=12)rect(x-2,yy,7,5,'#4c5360')}
      rect(x-9,320,30,5,open?'#72cfbc':'#dc865c');rect(x-9,391,30,5,open?'#72cfbc':'#dc865c');
    }
    Ship.label('HANGAR / 07',187,245,'#99adbb',12);Ship.label('ENGINEERING',526,422,'#a6b8be',12);Ship.label('COMMAND',843,436,'#a6b8be',12);
    Ship.label('MEDICAL',165,610,'#b8d5d8',9);Ship.label('TARGETING CORE',524,147,'#a8d9dd',9);
    // Reactor chamber.
    rect(478,157,92,109,'#23384d');rect(486,157,77,13,'#9aafb5');rect(486,251,77,13,'#9aafb5');
    for(let xx=491;xx<562;xx+=12){rect(xx,173,5,75,'#243d56');rect(xx+2,176,2,67,s.relays.length===3?'#536b79':'#66bcca')}
    rect(510,172,29,77,'#2b6677');rect(516,176,17,67,s.relays.length===3?'#506675':'#97e4d8');
    for(let yy=180;yy<246;yy+=14)rect(516,yy,17,3,'#d2eee3');
    rect(478,226,92,5,'#7596a5');rect(478,193,92,4,'#7596a5');
    // Brig wall leaves a clear approach from below.
    rect(474,437,106,44,'#23384d');rect(480,442,94,33,'#293f54');
    if(!s.freed)for(let x=485;x<574;x+=14){rect(x,440,4,38,'#99b8c3');rect(x+1,443,1,30,'#c3dde0')}
    Ship.label(s.freed?'BRIG / OPEN':'BRIG / LOCKED',527,436,s.freed?'#8bdbb9':'#e0b071',9);
    const things=[...Ship.entities().map(n=>({...n,kind:'node'})),{...state.p,kind:'player'},{...state.dog,kind:'dog'}].sort((a,b)=>a.y-b.y);
    for(const n of things){
      if(n.kind==='player'||n.kind==='dog'){ellipse(n.x,n.y-1,11,4,'#1c334866');sprite(n.kind==='player'?'gray':'kenobi',n.x,n.y,2,n.kind==='player'&&state.p.dir<0);continue}
      if(n.type==='shuttle'){
        ellipse(n.x,n.y-33,60,16,'#1a2e43');
        rect(n.x-52,n.y-51,104,17,'#647b8d');rect(n.x-43,n.y-68,86,26,'#8299a5');rect(n.x-29,n.y-78,58,44,'#bbc9c9');rect(n.x-23,n.y-74,46,17,'#264760');rect(n.x-20,n.y-72,39,3,'#6aacbe');
        rect(n.x-7,n.y-48,14,16,'#324b60');rect(n.x-11,n.y-32,22,27,'#95a9af');rect(n.x-8,n.y-30,16,22,'#627b8a');rect(n.x-57,n.y-45,9,17,'#d59b55');rect(n.x+48,n.y-45,9,17,'#d59b55');
        Ship.label('SHUTTLE',n.x,n.y+11,'#bbced1',9);
      }else if(n.type==='radio'){Ship.panel(n.x,n.y,30,25,'#f1bb6b');Ship.label('COMMS',n.x,n.y+11,'#d7bc8c',8)}
      else if(n.type==='medbay'){
        rect(n.x-22,n.y-30,44,29,'#b0c4c6');rect(n.x-19,n.y-27,38,22,'#355d6b');rect(n.x-3,n.y-23,6,15,'#a6eee0');rect(n.x-8,n.y-19,16,6,'#a6eee0');
      }else if(n.type==='supply'){
        const opened=n.id==='supply2'?s.supplies:s.cache;
        rect(n.x-15,n.y-22,30,23,'#253c52');rect(n.x-13,n.y-20,26,17,opened?'#344b5f':'#879fa9');rect(n.x-13,n.y-13,26,3,'#d4ac62');rect(n.x-2,n.y-14,4,5,'#e8cd88');
      }else if(n.type==='terminal'){Ship.panel(n.x,n.y,32,25);Ship.label('SCHEMATIC',n.x,n.y+12,'#afd1d9',8)}
      else if(n.type==='relay'){const lit=s.relays.includes(n.label);Ship.panel(n.x,n.y,35,32,lit?'#85d4a1':'#e2ac65');Ship.label(n.label,n.x,n.y+14,lit?'#abf0c3':'#f0d28f',12)}
      else if(n.type==='holo'){
        ellipse(n.x,n.y,34,8,'#2e697a');ellipse(n.x,n.y-3,26,5,'#68b4b4');ctx.save();ctx.globalAlpha=.7+Math.sin(clock*3)*.1;ctx.drawImage(sprites.cobris,n.x-29,n.y-68,58,61);ctx.restore();
      }else{ellipse(n.x,n.y,13,4,'#263e4e77');sprite(n.type,n.x,n.y,n.type.startsWith('b2')?2.2:2)}
      const target=state.quest===0?'radio':state.quest===1?'deckguard':state.quest===2?'scout':state.quest===3?'relay-'+Ship.relayOrder[s.relays.length]:state.quest===4?'captain':state.quest===5?'shuttle':null;
      if(n.id===target)marker(n.x,n.y-(n.type==='shuttle'?26:0));
    }
    rect(40,622,944,13,'#23394d');rect(42,622,940,3,'#95a5ac');
  },
  drawBattle(){
    const W=canvas.width,H=canvas.height,mid=H<500?H*.56:H*.44;
    rect(0,0,W,H,'#253d55');Ship.stars(24,12,W-48,H*.31);
    ellipse(W*.75,H*.14,78,27,'#285876');ellipse(W*.74,H*.12,66,18,'#488794');
    for(let x=0;x<W;x+=106){rect(x,0,11,H*.33,'#668093');rect(x+2,3,3,H*.32,'#9eb7bf');rect(x,H*.31,106,9,'#899da7');rect(x+10,H*.30,77,2,'#d4a66a')}
    for(let y=H*.34;y<H;y+=18)for(let x=0;x<W;x+=32){rect(x,y,31,17,(Math.floor(y/18)+x/32)%2?'#536a7b':'#4b6275');rect(x+2,y+1,27,1,'#728795')}
    for(let x=0;x<W;x+=20){rect(x,H*.68,12,4,'#dbad5d');rect(x,H*.69+5,12,2,'#213b52')}
    ellipse(W*.25,mid,45,11,'#1d354a66');ellipse(W*.73,mid,50,12,'#1d354a77');
    sprite('gray',W*.25,mid,3.5,false,Math.sin(clock*3));sprite('kenobi',W*.34,mid+29,3,false,Math.sin(clock*4));
    sprite(state.enemy.kind==='b2captain'?'b2captain':'b2',W*.73,mid-4,state.enemy.kind==='b2captain'?4.3:4,true,Math.sin(clock*2)*.5);
    if(state.enemy.turn%3===2){rect(W*.66,mid-48,4,4,'#f1b06c');rect(W*.66-5,mid-43,3,3,'#ffe0a1')}
    if(state.guard)for(let i=0;i<3;i++){rect(W*.4,mid-42+i*16,18,15,'#8d9d9f');rect(W*.4+2,mid-40+i*16,14,3,'#c4d0d0')}
    if(state.hitTime>0){ctx.font='bold 23px monospace';ctx.textAlign='center';ctx.fillStyle=state.hitTarget==='gray'?'#ffbd94':'#fff0ab';ctx.strokeStyle='#1b3146';ctx.lineWidth=3;const x=state.hitTarget==='gray'?W*.25:W*.73,y=mid-85-(1-state.hitTime)*15;ctx.strokeText(state.hitText,x,y);ctx.fillText(state.hitText,x,y)}
    if(state.flash>0)rect(0,0,W,H,'#eff8ff22');
  }
};
