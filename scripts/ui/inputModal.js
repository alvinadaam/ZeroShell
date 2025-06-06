// Reusable input modal and inline prompt for ZeroShell CLI/IDE

let inputModal = null;
let inputResolve = null;
let inputReject = null;

function showInputModal({ prompt = "Enter value:", password = false, multiline = false, history = [], mode = "modal" } = {}) {
  return new Promise((resolve, reject) => {
    // Remove any existing modal
    hideInputModal();

    // Blur and temporarily disable shell input while modal/inline is active
    const shellInput = document.getElementById('command-input');
    if (shellInput) {
      shellInput.blur();
      shellInput.disabled = true;
    }

    if (mode === "inline") {
      // Inline prompt in terminal
      const terminal = document.getElementById('terminal-output');
      const div = document.createElement('div');
      div.className = "input-inline";
      div.style = "margin:8px 0;padding:6px 0;";
      div.innerHTML = `<span style="color:#00ff44;">${prompt}</span> <input id="input-inline-box" type="${password ? "password" : "text"}" style="background:#111;color:#fff;border:1px solid #00ff44;border-radius:4px;padding:2px 8px;font-size:1em;width:220px;">`;
      terminal.appendChild(div);
      const input = div.querySelector('input');
      setTimeout(() => input.focus(), 10); // Ensure focus
      input.onkeydown = (e) => {
        if (e.key === "Enter") {
          resolve(input.value);
          div.remove();
          if (shellInput) {
            shellInput.disabled = false;
            shellInput.focus();
          }
        } else if (e.key === "Escape") {
          reject();
          div.remove();
          if (shellInput) {
            shellInput.disabled = false;
            shellInput.focus();
          }
        }
      };
      inputModal = div;
      inputResolve = resolve;
      inputReject = reject;
      return;
    }

    // Overlay modal
    inputModal = document.createElement('div');
    inputModal.id = "input-modal";
    inputModal.style = `
      position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);
      background: #181; color: #fff; border: 2px solid #00ff44; border-radius: 10px;
      z-index: 10020; min-width: 320px; min-height: 120px; box-shadow: 0 0 32px #00ff44cc;
      display: flex; flex-direction: column; align-items: stretch; padding: 0;
      animation: inputModalFadeIn 0.18s;
    `;
    inputModal.innerHTML = `
      <div style="padding: 14px 18px; font-size:1.1em; background:#222; border-radius:10px 10px 0 0;">
        ${prompt}
      </div>
      <div style="padding: 18px 18px 10px 18px; background:#111;">
        ${multiline
          ? `<textarea id="input-modal-box" style="width:100%;height:60px;background:#111;color:#fff;border:1px solid #00ff44;border-radius:4px;font-size:1em;"></textarea>`
          : `<input id="input-modal-box" type="${password ? "password" : "text"}" style="width:100%;background:#111;color:#fff;border:1px solid #00ff44;border-radius:4px;font-size:1em;">`
        }
      </div>
      <div style="padding: 8px 18px 14px 18px; display:flex;justify-content:flex-end;gap:10px;">
        <button id="input-modal-cancel" style="background:#222;color:#fff;padding:4px 16px;border:none;border-radius:4px;cursor:pointer;">Cancel</button>
        <button id="input-modal-ok" style="background:#00ff44;color:#000;padding:4px 16px;border:none;border-radius:4px;cursor:pointer;">OK</button>
      </div>
    `;
    document.body.appendChild(inputModal);

    const input = inputModal.querySelector('#input-modal-box');
    setTimeout(() => input.focus(), 10);

    input.onkeydown = (e) => {
      if (e.key === "Enter" && !multiline) {
        resolve(input.value);
        hideInputModal();
        if (shellInput) {
          shellInput.disabled = false;
          shellInput.focus();
        }
      } else if (e.key === "Escape") {
        reject();
        hideInputModal();
        if (shellInput) {
          shellInput.disabled = false;
          shellInput.focus();
        }
      }
    };
    inputModal.querySelector('#input-modal-ok').onclick = () => {
      resolve(input.value);
      hideInputModal();
      if (shellInput) {
        shellInput.disabled = false;
        shellInput.focus();
      }
    };
    inputModal.querySelector('#input-modal-cancel').onclick = () => {
      reject();
      hideInputModal();
      if (shellInput) {
        shellInput.disabled = false;
        shellInput.focus();
      }
    };

    inputResolve = resolve;
    inputReject = reject;
  });
}

function hideInputModal() {
  if (inputModal) {
    inputModal.remove();
    inputModal = null;
    inputResolve = null;
    inputReject = null;
  }
  // Always re-enable shell input after modal closes
  const shellInput = document.getElementById('command-input');
  if (shellInput) shellInput.disabled = false;
}

export { showInputModal, hideInputModal };
