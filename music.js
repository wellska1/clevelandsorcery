'use strict';
// Original, locally synthesized score. No downloads or autoplay permissions needed.
// Four eight-bar sections vary melody, harmony, orchestration and endings.
class AdventureScore {
  static tracks = {
    forest:{name:'Greenwood · A Brave Little Journey',bpm:96,key:48,scale:[0,2,4,5,7,9,11],roots:[0,5,3,4,2,5,3,4]},
    ship:{name:'The Iron Serpent · Behind Enemy Lines',bpm:124,key:45,scale:[0,2,3,5,7,8,10],roots:[0,0,5,3,0,5,3,4]},
    battle:{name:'Stand Together!',bpm:152,key:50,scale:[0,2,3,5,7,8,10],roots:[0,0,5,3,0,2,5,4]},
    boss:{name:'Against All Odds',bpm:168,key:50,scale:[0,2,3,5,7,8,10],roots:[0,5,3,4,0,2,5,4]},
    victory:{name:'A Small Hero’s Victory',bpm:132,key:50,scale:[0,2,4,5,7,9,11],roots:[0,3,4,0]},
    rest:{name:'Courage Returns',bpm:72,key:48,scale:[0,2,4,5,7,9,11],roots:[5,3,0,4]}
  };
  static melodies = [
    [[0,2,4,-1,2,1,0,-1],[2,-1,4,5,4,-1,2,-1],[4,5,7,-1,5,4,2,-1],[1,2,4,2,1,-1,0,-1]],
    [[4,-1,5,4,2,1,2,-1],[7,6,5,-1,4,2,1,-1],[2,4,5,7,5,-1,4,2],[4,2,1,-1,0,-1,-1,-1]],
    [[0,-1,-1,2,1,-1,-1,-1],[2,-1,1,-1,0,-1,-1,-1],[4,-1,2,-1,1,-1,2,-1],[1,-1,0,-1,-1,-1,-1,-1]],
    [[0,2,4,5,7,-1,5,4],[2,4,5,-1,4,2,1,2],[4,5,7,5,4,2,1,-1],[2,1,0,-1,4,2,0,-1]]
  ];
  static combat = [
    [[0,0,4,0,5,4,2,1],[0,2,4,5,4,2,1,0],[4,4,5,7,5,4,2,4],[5,4,2,1,0,1,2,4]],
    [[7,-1,5,4,5,7,9,7],[5,4,2,4,5,-1,4,2],[4,5,7,9,7,5,4,2],[1,2,4,2,1,0,1,-1]],
    [[0,-1,0,4,2,-1,1,0],[2,-1,4,2,1,0,-1,2],[4,-1,5,4,2,1,0,-1],[1,2,1,0,-1,4,2,1]],
    [[0,2,4,7,5,4,2,4],[5,7,9,7,5,4,2,1],[4,5,7,5,4,2,1,2],[4,2,1,0,1,2,4,1]]
  ];
  static shipMelodies = [
    [[0,-1,4,3,2,-1,1,-1],[0,-1,2,4,5,-1,4,-1],[4,-1,5,4,2,1,0,-1],[2,1,0,-1,1,-1,4,-1]],
    [[7,-1,7,5,4,-1,2,4],[5,4,2,-1,4,-1,5,-1],[4,5,7,-1,5,4,2,-1],[4,-1,2,1,0,-1,-1,-1]],
    [[0,-1,-1,-1,1,-1,0,-1],[2,-1,1,-1,0,-1,-1,-1],[4,-1,-1,2,1,-1,-1,-1],[1,-1,0,-1,4,3,2,1]],
    [[0,2,4,-1,5,4,2,1],[4,-1,5,7,5,-1,4,2],[7,5,4,2,4,5,7,-1],[4,2,1,0,1,-1,0,-1]]
  ];
  constructor(context,getScene){
    this.ctx=context;this.getScene=getScene;this.timer=null;this.lane=null;this.retired=new Set();
    this.step=0;this.cycles=0;this.next=0;this.track=null;this.cueUntil=0;this.ducked=false;
    this.output=context.createGain();this.output.gain.value=.85;
    this.compressor=context.createDynamicsCompressor();
    this.compressor.threshold.value=-15;this.compressor.ratio.value=5;
    this.output.connect(this.compressor);this.compressor.connect(context.destination);
    this.effects=context.createGain();this.effects.gain.value=.85;this.effects.connect(this.output);
    this.noise=context.createBuffer(1,context.sampleRate,context.sampleRate);
    const data=this.noise.getChannelData(0);let seed=91237;
    for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=seed/1073741823.5-1}
    const real=new Float32Array(17),imag=new Float32Array(17);
    for(let n=1;n<17;n++)imag[n]=Math.sin(n*Math.PI*.3)/n;
    this.pulse=context.createPeriodicWave(real,imag);
  }
  noteAt(track,degree){const s=track.scale;return track.key+12*Math.floor(degree/7)+s[((degree%7)+7)%7]}
  voice(midi,time,duration,volume,type='triangle',lane=this.lane){
    if(!lane)return;
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    if(type==='pulse')o.setPeriodicWave(this.pulse);else o.type=type;
    o.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),time);
    g.gain.setValueAtTime(.0001,time);
    g.gain.exponentialRampToValueAtTime(volume,time+.012);
    g.gain.exponentialRampToValueAtTime(Math.max(.0001,volume*.48),time+duration*.55);
    g.gain.exponentialRampToValueAtTime(.0001,time+duration);
    o.connect(g);g.connect(lane.gain);o.start(time);o.stop(time+duration+.025);
    lane.sources.add(o);o.onended=()=>{o.disconnect();g.disconnect();lane.sources.delete(o)};
  }
  drum(kind,time,level=1,lane=this.lane){
    const c=this.ctx,g=c.createGain();
    if(kind==='kick'){
      const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(125,time);
      o.frequency.exponentialRampToValueAtTime(43,time+.13);
      g.gain.setValueAtTime(.1*level,time);g.gain.exponentialRampToValueAtTime(.0001,time+.19);
      o.connect(g);g.connect(lane.gain);o.start(time);o.stop(time+.2);
      lane.sources.add(o);o.onended=()=>{o.disconnect();g.disconnect();lane.sources.delete(o)};
    }else{
      const n=c.createBufferSource(),filter=c.createBiquadFilter(),hat=kind==='hat';
      n.buffer=this.noise;filter.type=hat?'highpass':'bandpass';filter.frequency.value=hat?6200:1900;
      filter.Q.value=.7;const len=hat?.045:.14;
      g.gain.setValueAtTime((hat?.012:.052)*level,time);
      g.gain.exponentialRampToValueAtTime(.0001,time+len);
      n.connect(filter);filter.connect(g);g.connect(lane.gain);n.start(time);n.stop(time+len+.01);
      lane.sources.add(n);n.onended=()=>{n.disconnect();filter.disconnect();g.disconnect();lane.sources.delete(n)};
    }
  }
  retire(lane){
    if(!lane)return;const t=this.ctx.currentTime;
    lane.gain.gain.cancelScheduledValues(t);lane.gain.gain.setTargetAtTime(0,t,.045);
    this.retired.add(lane);
    lane.cleanup=setTimeout(()=>{
      for(const n of lane.sources){try{n.stop()}catch{}}
      lane.gain.disconnect();this.retired.delete(lane);
    },350);
  }
  switchTo(id){
    this.retire(this.lane);const c=this.ctx,g=c.createGain();
    g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(1,c.currentTime+.18);
    g.connect(this.output);this.lane={gain:g,sources:new Set()};
    this.track=id;this.step=0;this.cycles=0;this.next=c.currentTime+.035;
  }
  desired(){
    const s=this.getScene();
    if(s.mode==='defeat')return 'rest';
    if(s.mode==='battle')return ['scales','b2captain'].includes(s.enemy)?'boss':'battle';
    return s.chapter===2?'ship':'forest';
  }
  tick(){
    if(this.ctx.state!=='running')return;
    const scene=this.getScene(),wanted=this.desired();
    if(this.track==='victory'&&(this.ctx.currentTime>=this.cueUntil||scene.mode==='battle'||scene.mode==='defeat'))this.switchTo(wanted);
    else if(this.track!=='victory'&&wanted!==this.track)this.switchTo(wanted);
    const duck=scene.paused||scene.mode==='dialog';
    if(duck!==this.ducked){this.output.gain.setTargetAtTime(duck?.48:.85,this.ctx.currentTime,.12);this.ducked=duck}
    // If the browser throttled a background tab, resume without a burst of old notes.
    if(this.next<this.ctx.currentTime-.2)this.next=this.ctx.currentTime+.025;
    const tr=AdventureScore.tracks[this.track],beat=60/tr.bpm;
    while(this.next<this.ctx.currentTime+.12){
      if(this.track==='victory'&&this.step>=32)break;
      this.schedule(this.step,this.next,tr);this.step++;this.next+=beat/2;
    }
  }
  schedule(step,time,tr){
    const combat=this.track==='battle'||this.track==='boss',win=this.track==='victory',rest=this.track==='rest';
    const ship=this.track==='ship';
    const bar=Math.floor(step/8)%32,pos=step%8,section=Math.floor(bar/8),cycle=Math.floor(step/256),beat=60/tr.bpm;
    this.cycles=cycle;
    let root=tr.roots[bar%tr.roots.length];
    // The second eight bars answer the opening with a different harmonic route.
    if(section===1&&!win)root=[3,4,2,5,3,0,5,4][bar%8];
    if(section===2&&!win)root=[5,3,0,4,5,2,3,4][bar%8];
    // Raised leading tone on the ship's dominant chord adds tension before returning home.
    const midi=d=>this.noteAt(tr,root+d)+(ship&&root===4&&((root+d)%7+7)%7===6?1:0);
    const patterns=combat?AdventureScore.combat:ship?AdventureScore.shipMelodies:AdventureScore.melodies;
    const phrase=patterns[section][(bar+(cycle%2)*2)%4];
    let degree=phrase[pos];
    if(win)degree=[[0,2,4,7,-1,7,7,-1],[5,-1,4,2,4,-1,5,-1],[4,5,4,2,1,2,4,5],[7,-1,-1,-1,0,-1,-1,-1]][bar%4][pos];
    if(rest&&pos%2)degree=-1;
    if(degree>=0){
      // Phrase-ending rests and longer notes keep exploration from becoming a constant arpeggio.
      const duration=beat*(phrase[pos+1]===-1?.86:.43);
      this.voice(midi(degree)+12,time,rest?beat*.9:duration,combat?.037:ship?.04:.046,combat||ship?'pulse':'triangle');
      if(ship&&section!==2&&pos%2===0)this.voice(midi(degree),time+.015,duration*1.4,.019,'triangle');
      if(section===3&&pos%2===0&&!rest)this.voice(midi(degree-2)+12,time+.012,duration,.011,'triangle');
    }
    if(pos===0){
      for(const d of [0,2,4])this.voice(midi(d),time,beat*3.7,combat?.009:ship?.016:.013,'sine');
      if(ship)this.voice(midi(0)-24,time,beat*3.4,.045,'sine');
    }
    const bassStep=combat||ship?pos%2===0:(pos===0||pos===4);
    if(bassStep)this.voice(midi(pos===4?4:0)-12,time,beat*(combat||ship?.7:1.5),combat?.065:ship?.07:.05,'triangle');
    if((combat||this.track==='ship')&&!(section===2&&pos%2)){
      const arp=[0,4,2,4,0,4,2,6][pos];
      this.voice(midi(arp),time,beat*.29,combat?.013:.012,'pulse');
    }
    if(combat){
      if(pos===0||pos===4||(section!==2&&pos===3))this.drum('kick',time);
      if(pos===2||pos===6)this.drum('snare',time,.85);
      this.drum('hat',time,pos%2?.7:1);
      if(bar%8===7&&pos>=6){this.drum('snare',time+beat/4,.4);this.voice(midi(4+pos%3),time+beat/4,beat*.18,.019,'pulse')}
      if(this.track==='boss'&&pos%2===1)this.voice(midi(pos===7?1:0)-12,time,beat*.24,.035,'pulse');
    }else if(ship){
      // A measured military march, with a sparse middle section and an escalating finale.
      if(pos===0||pos===4)this.drum('kick',time,section===2?.45:.75);
      if(section!==2&&(pos===2||pos===6))this.drum('snare',time,.48);
      if(section!==2&&pos%2===1)this.drum('hat',time,.6);
      if(section===3&&pos===7)this.drum('snare',time+beat/4,.32);
      if(bar%8===7&&pos>=6)this.voice(midi(0)-12,time+beat/4,beat*.18,.037,'triangle');
    }else if(!rest&&!win&&section!==2){
      if(pos===0)this.drum('kick',time,.32);
      if(pos===2||pos===6)this.drum('hat',time,.6);
    }
  }
  cueVictory(){
    if(!this.timer)return;this.switchTo('victory');
    this.cueUntil=this.next+16*60/AdventureScore.tracks.victory.bpm;
  }
  start(){if(this.timer)return;this.switchTo(this.desired());this.timer=setInterval(()=>this.tick(),25);this.tick()}
  stop(){
    clearInterval(this.timer);this.timer=null;this.cueUntil=0;
    // Stop scheduled sources too, so unmuting cannot replay stale battle notes.
    for(const lane of [this.lane,...this.retired]){
      if(!lane)continue;clearTimeout(lane.cleanup);
      for(const n of lane.sources){try{n.stop()}catch{}}
      lane.gain.disconnect();
    }
    this.retired.clear();this.lane=null;this.track=null;
  }
  status(){const tr=AdventureScore.tracks[this.track];return {enabled:!!this.timer,track:this.track,title:tr?.name||null,bpm:tr?.bpm||0,bar:Math.floor(this.step/8)%32+1,section:Math.floor(this.step/64)%4+1,activeVoices:this.lane?.sources.size||0,context:this.ctx.state}}
}
