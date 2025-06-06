import vfsManager from '../tools/vfsManager.js';

const randomStats = [
  "VFS: OK",
  "Modules: 12 loaded",
  "Network: 127.0.0.1",
  "Entropy: 98%",
  "RAM: 12MB/128MB",
  "CPU: 37°C",
  "Disk: clean",
  "Security: pass",
  "ZeroShell v1.0.0",
  "Mount: /home",
  "Mount: /usr",
  "Mount: /bin",
  "Mount: /etc",
  "Mount: /dev",
  "Mount: /tmp"
];

function getRandomStats(n) {
  const arr = [];
  const used = new Set();
  while (arr.length < n && used.size < randomStats.length) {
    const idx = Math.floor(Math.random() * randomStats.length);
    if (!used.has(idx)) {
      arr.push(randomStats[idx]);
      used.add(idx);
    }
  }
  return arr;
}

const bootScreen = {
  async show() {
    const boot = document.getElementById('boot-screen');
    if (!boot) return;
    boot.style.display = 'flex';
    boot.innerHTML = `
      <div class="boot-glitch"></div>
      <div class="boot-logo">ZeroShell</div>
      <div class="boot-loader">
        <div class="boot-bar-container">
          <div class="boot-bar" id="boot-bar"></div>
        </div>
        <div class="boot-analyzing" id="boot-analyzing">Analyzing system...</div>
        <div class="boot-file" id="boot-file"></div>
        <div class="boot-stats" id="boot-stats"></div>
      </div>
    `;
    boot.classList.remove('hide');

    // Animate loading bar and show file content from VFS
    const bar = document.getElementById('boot-bar');
    const fileDiv = document.getElementById('boot-file');
    const statsDiv = document.getElementById('boot-stats');
    let progress = 0;
    let fileContent = '';
    try {
      // Simulate reading a file from VFS (e.g., /etc/config.txt)
      const node = await vfsManager.getNode('/etc/config.txt');
      if (node && node.type === 'file') {
        fileContent = node.content;
      }
    } catch (e) {
      fileContent = '';
    }

    // Animate loading bar with pro feel
    const steps = [15, 35, 60, 80, 100];
    const texts = [
      "Analyzing system...",
      "Loading VFS...",
      "Reading /etc/config.txt...",
      "Finalizing...",
      "Ready."
    ];
    const statsArr = getRandomStats(4);
    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 350));
      progress = steps[i];
      if (bar) bar.style.width = progress + '%';
      const analyzing = document.getElementById('boot-analyzing');
      if (analyzing) analyzing.textContent = texts[i];
      if (progress === 60 && fileDiv && fileContent) {
        fileDiv.textContent = `Loaded: /etc/config.txt → "${fileContent}"`;
      }
      if (statsDiv && statsArr[i]) {
        statsDiv.innerHTML += `<div>${statsArr[i]}</div>`;
      }
    }
    await new Promise(res => setTimeout(res, 400));
  },
  hide() {
    const boot = document.getElementById('boot-screen');
    if (!boot) return;
    boot.classList.add('hide');
    setTimeout(() => { boot.style.display = 'none'; }, 800);
  },
  async shutdown() {
    const boot = document.getElementById('boot-screen');
    if (!boot) return;
    boot.style.display = 'flex';
    boot.innerHTML = `
      <div class="boot-glitch"></div>
      <div class="boot-logo">ZeroShell</div>
      <div class="shutdown-msg">System is shutting down...</div>
      <div class="shutdown-bar-container">
        <div class="shutdown-bar" id="shutdown-bar"></div>
      </div>
    `;
    boot.classList.remove('hide');
    // Animate shutdown bar
    const bar = document.getElementById('shutdown-bar');
    const steps = [20, 40, 65, 85, 100];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 300));
      if (bar) bar.style.width = steps[i] + '%';
    }
    await new Promise(res => setTimeout(res, 700));
    boot.innerHTML += `<div class="shutdown-msg" style="margin-top:1.2rem;">ZeroShell is now off.</div>`;
  }
};

export default bootScreen;
