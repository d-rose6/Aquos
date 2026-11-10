/* Detalhes do Dispositivo — JS puro, sem dependências, funciona offline (file://) */
(function () {
  'use strict';

  var CONFIG = {
    deviceName: 'Cozinha',
    deviceId: '1',
    status: 'Online',          // 'Online' | 'Offline'
    valveControlEnabled: false, // controle desativado por enquanto
    liveFlow: true
  };

  var state = { open: false, flow: 0, total: 29.24, today: 29.24, month: 0.85 };

  var el = {
    deviceName: document.getElementById('deviceName'),
    deviceId: document.getElementById('deviceId'),
    statusDot: document.getElementById('statusDot'),
    statusLabel: document.getElementById('statusLabel'),
    flow: document.getElementById('flow'),
    today: document.getElementById('today'),
    month: document.getElementById('month'),
    drops: document.getElementById('drops'),
    pool: document.getElementById('pool'),
    chips: document.querySelectorAll('[data-valve-chip]'),
    actions: document.getElementById('valveActions'),
    tag: document.getElementById('valveTag'),
    btnOpen: document.getElementById('btnOpen'),
    btnClose: document.getElementById('btnClose'),
    btnToggle: document.getElementById('btnToggle')
  };

  function fmt(n) { return n.toFixed(2); }

  /* ---- animação de gotas: densidade e velocidade derivam do fluxo ---- */
  var lastSignature = '';

  function renderDrops() {
    var intensity = Math.min(1, state.flow / 10);
    var step = Math.round(intensity * 5) / 5;           // quantizado: evita reiniciar a cada tick
    var count = state.open ? Math.max(2, Math.round(step * 12)) : 0;
    var speed = state.open ? +(1.5 - step * 0.95).toFixed(2) : 1.5;
    var signature = count + '|' + speed;
    if (signature === lastSignature) { return; }
    lastSignature = signature;

    el.drops.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var d = document.createElement('span');
      d.className = 'drop';
      d.style.left = ((i % 3 - 1) * 1.5 - 5) + 'px';
      d.style.animationDuration = speed + 's';
      d.style.animationDelay = (i * speed / count).toFixed(2) + 's';
      el.drops.appendChild(d);
    }
    if (count) {
      var s = document.createElement('span');
      s.className = 'splash';
      s.style.animationDuration = speed + 's';
      el.drops.appendChild(s);
    }
  }

  function render() {
    var online = CONFIG.status === 'Online';
    el.deviceName.textContent = CONFIG.deviceName;
    el.deviceId.textContent = CONFIG.deviceId;
    el.statusLabel.textContent = CONFIG.status;
    el.statusDot.style.background = online ? '#3ecf7a' : '#ec3013';

    el.flow.textContent = fmt(state.flow);
    el.today.textContent = fmt(state.today);
    el.month.textContent = fmt(state.month);

    var intensity = Math.min(1, state.flow / 10);
    el.pool.style.height = state.open ? (6 + intensity * 26).toFixed(0) + 'px' : '0px';
    el.pool.classList.toggle('pool--on', state.open);

    for (var i = 0; i < el.chips.length; i++) {
      el.chips[i].textContent = state.open ? 'Aberta' : 'Fechada';
      el.chips[i].style.background = state.open ? 'var(--water)' : 'var(--danger)';
    }

    var on = CONFIG.valveControlEnabled;
    el.actions.classList.toggle('is-disabled', !on);
    el.actions.setAttribute('aria-disabled', String(!on));
    el.tag.style.display = on ? 'none' : '';
    el.btnOpen.disabled = !on || state.open;
    el.btnClose.disabled = !on || !state.open;
    el.btnToggle.disabled = !on;

    renderDrops();
  }

  function setValve(open) {
    if (!CONFIG.valveControlEnabled) { return; }
    state.open = open;
    state.flow = open ? 6.4 : 0;
    render();
  }

  el.btnOpen.addEventListener('click', function () { setValve(true); });
  el.btnClose.addEventListener('click', function () { setValve(false); });
  el.btnToggle.addEventListener('click', function () { setValve(!state.open); });

  setInterval(function () {
    if (!state.open || !CONFIG.liveFlow) { return; }
    state.flow = Math.max(0, 6.4 + (Math.random() - 0.5) * 1.6);
    var add = state.flow / 60;
    state.total += add;
    state.today += add;
    state.month += add;
    render();
  }, 1000);

  render();

  // Para religar o controle da válvula: window.HidroConfig.valveControlEnabled = true; (e recarregar)
  window.HidroConfig = CONFIG;
})();
