/* simple JSON-driven audio player + InnerQuest starter */
(async function(){
  // load tracks.json
  async function loadJSON(path){
    const res = await fetch(path);
    return await res.json();
  }

  // Player logic
  const audio = new Audio();
  audio.preload = 'metadata';
  const playBtn = document.getElementById('play-toggle');
  const nextBtn = document.getElementById('next-track');
  const prevBtn = document.getElementById('prev-track');
  const titleEl = document.getElementById('track-title');

  let tracks = [];
  let idx = 0;

  try{
    tracks = await loadJSON('/content/tracks.json');
    if(tracks && tracks.length) setTrack(0);
  }catch(e){
    console.warn('No tracks.json found yet', e);
  }

  function setTrack(i){
    if(!tracks.length) return;
    idx = (i + tracks.length) % tracks.length;
    audio.src = tracks[idx].src;
    titleEl && (titleEl.textContent = tracks[idx].title || 'track');
    audio.load();
  }

  playBtn && playBtn.addEventListener('click', ()=>{
    if(audio.paused) audio.play(); else audio.pause();
  });

  nextBtn && nextBtn.addEventListener('click', ()=> setTrack(idx+1));
  prevBtn && prevBtn.addEventListener('click', ()=> setTrack(idx-1));

  audio.addEventListener('play', ()=> playBtn && (playBtn.textContent = 'pause'));
  audio.addEventListener('pause', ()=> playBtn && (playBtn.textContent = 'play'));

  // Simple InnerQuest interactive map (JSON-driven)
  // Example file: /content/quest.json
  const questContainer = document.getElementById('innerquest');
  if(!questContainer) return;
  try{
    const quest = await loadJSON('/content/quest.json');
    // render nodes
    quest.nodes.forEach(node=>{
      const n = document.createElement('button');
      n.className = 'btn';
      n.style.margin = '6px';
      n.textContent = node.title;
      n.onclick = ()=> {
        // show node detail (basic)
        alert(node.title + '\n\n' + (node.desc || ''));
        // here you could navigate to node.link, or show modal, or unlock content
        if(node.link) window.location = node.link;
      };
      questContainer.appendChild(n);
    });
  }catch(e){
    console.warn('no quest.json or error', e);
  }
})();
