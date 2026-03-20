/* ══════════════════════════════════════════════════
   CineDigital – app.js
   Panel de Administración UI
   ══════════════════════════════════════════════════ */

const API = 'http://localhost:3000/api';

/* ════════════════════════════════════════════════════
   UTILIDADES
   ════════════════════════════════════════════════════ */

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Toast ────────────────────────────────────────── */
function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2600);
  setTimeout(() => t.remove(), 3000);
}

/* ── API helpers ──────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Error ${res.status}`);
  }
  return data;
}

function apiGet(path)         { return apiFetch(path); }
function apiPost(path, body)  { return apiFetch(path, { method: 'POST',  body: JSON.stringify(body) }); }
function apiPut(path, body)   { return apiFetch(path, { method: 'PUT',   body: JSON.stringify(body) }); }
function apiDel(path)         { return apiFetch(path, { method: 'DELETE' }); }

/* ════════════════════════════════════════════════════
   NAVEGACIÓN
   ════════════════════════════════════════════════════ */

const SECTIONS = ['dashboard', 'generos', 'directores', 'productoras', 'tipos', 'media'];
const TITLES   = {
  dashboard:  'Dashboard',
  generos:    'Géneros',
  directores: 'Directores',
  productoras:'Productoras',
  tipos:      'Tipos de Multimedia',
  media:      'Películas & Series',
};

let currentSection = 'dashboard';

function showSection(name) {
  SECTIONS.forEach(s => {
    document.getElementById('section-' + s).classList.toggle('active', s === name);
  });
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.section === name);
  });
  document.getElementById('topbarTitle').textContent = TITLES[name];
  currentSection = name;
  loadSection(name);
}

async function loadSection(name) {
  switch (name) {
    case 'dashboard':  loadDashboard(); break;
    case 'generos':    loadGeneros(); break;
    case 'directores': loadDirectores(); break;
    case 'productoras':loadProductoras(); break;
    case 'tipos':      loadTipos(); break;
    case 'media':      loadMedia(); break;
  }
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showSection(btn.dataset.section);
    // cerrar sidebar en móvil
    document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

/* ════════════════════════════════════════════════════
   MODAL GENÉRICO
   ════════════════════════════════════════════════════ */

let modalSaveCb = null;

function openModal(title, bodyHtml, saveCb) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  modalSaveCb = saveCb;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  modalSaveCb = null;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.getElementById('modalSave').addEventListener('click', () => {
  if (modalSaveCb) modalSaveCb();
});

/* ════════════════════════════════════════════════════
   CONFIRM DIALOG
   ════════════════════════════════════════════════════ */

let confirmCb = null;

function confirm(msg, cb) {
  document.getElementById('confirm-msg').textContent = msg;
  confirmCb = cb;
  document.getElementById('confirmOverlay').classList.add('open');
}

document.getElementById('confirmNo').addEventListener('click', () => {
  document.getElementById('confirmOverlay').classList.remove('open');
  confirmCb = null;
});
document.getElementById('confirmYes').addEventListener('click', () => {
  document.getElementById('confirmOverlay').classList.remove('open');
  if (confirmCb) confirmCb();
  confirmCb = null;
});

/* ════════════════════════════════════════════════════
   DETALLE MEDIA
   ════════════════════════════════════════════════════ */

function openDetail(title, bodyHtml) {
  document.getElementById('detail-title').textContent = title;
  document.getElementById('detail-body').innerHTML = bodyHtml;
  document.getElementById('detailOverlay').classList.add('open');
}

document.getElementById('detailClose').addEventListener('click', () => {
  document.getElementById('detailOverlay').classList.remove('open');
});
document.getElementById('detailOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('detailOverlay'))
    document.getElementById('detailOverlay').classList.remove('open');
});

/* ════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════ */

async function loadDashboard() {
  try {
    const [g, d, p, t, m] = await Promise.all([
      apiGet('/generos'),
      apiGet('/directores'),
      apiGet('/productoras'),
      apiGet('/tipos'),
      apiGet('/media'),
    ]);

    const list = (r) => r.data || r || [];

    document.getElementById('count-generos').textContent    = list(g).length;
    document.getElementById('count-directores').textContent = list(d).length;
    document.getElementById('count-productoras').textContent= list(p).length;
    document.getElementById('count-tipos').textContent      = list(t).length;
    document.getElementById('count-media').textContent      = list(m).length;

    const mediaList = list(m).slice(0, 8);
    const rc = document.getElementById('recent-media');
    if (mediaList.length === 0) {
      rc.innerHTML = '<p class="empty-msg">No hay producciones registradas aún.</p>';
      return;
    }
    rc.innerHTML = mediaList.map(item => {
      const poster = item.portada
        ? `<img src="${escHtml(item.portada)}" alt="${escHtml(item.titulo)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-size:48px">🎞️</div>`
        : `<div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:48px">🎞️</div>`;
      return `
        <div class="media-card" onclick='showMediaDetail(${JSON.stringify(item)})'>
          <div class="media-card-poster">${poster}</div>
          <div class="media-card-body">
            <div class="media-card-title">${escHtml(item.titulo)}</div>
            <div class="media-card-sub">${escHtml(item.anio_estreno || '')} · ${escHtml(item.tipo_nombre || item.tipo || '')}</div>
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    toast('Error cargando dashboard: ' + e.message, 'error');
  }
}

/* ════════════════════════════════════════════════════
   GÉNEROS
   ════════════════════════════════════════════════════ */

async function loadGeneros() {
  const tbody = document.querySelector('#table-generos tbody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Cargando...</td></tr>';
  try {
    const res = await apiGet('/generos');
    const rows = (res.data || res || []);
    if (rows.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Sin registros</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(g => `
      <tr>
        <td>${g.id}</td>
        <td><strong>${escHtml(g.nombre)}</strong></td>
        <td><span class="badge badge-${(g.estado||'').toLowerCase()}">${escHtml(g.estado)}</span></td>
        <td class="truncate">${escHtml(g.descripcion)}</td>
        <td>${fmtDate(g.createdAt)}</td>
        <td>${fmtDate(g.updatedAt)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="Editar" onclick='editGenero(${JSON.stringify(g)})'>✏️</button>
            <button class="btn-icon del" title="Eliminar" onclick="delGenero(${g.id},'${escHtml(g.nombre)}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Error: ' + escHtml(e.message) + '</td></tr>';
  }
}

document.getElementById('btn-new-genero').addEventListener('click', () => {
  openModal('Nuevo Género', formGenero(), saveGenero);
});

function formGenero(g = {}) {
  return `
    <div class="form-group">
      <label>Nombre *</label>
      <input id="f-nombre" class="input-field" value="${escHtml(g.nombre||'')}" placeholder="Ej: Acción" />
    </div>
    <div class="form-group">
      <label>Estado</label>
      <select id="f-estado" class="input-field">
        <option value="Activo"   ${(g.estado||'Activo')==='Activo'?'selected':''}>Activo</option>
        <option value="Inactivo" ${g.estado==='Inactivo'?'selected':''}>Inactivo</option>
      </select>
    </div>
    <div class="form-group">
      <label>Descripción</label>
      <textarea id="f-descripcion" class="input-field">${escHtml(g.descripcion||'')}</textarea>
    </div>`;
}

async function saveGenero(id) {
  const body = {
    nombre:      document.getElementById('f-nombre').value.trim(),
    estado:      document.getElementById('f-estado').value,
    descripcion: document.getElementById('f-descripcion').value.trim(),
  };
  if (!body.nombre) { toast('El nombre es requerido', 'warning'); return; }
  try {
    if (id) {
      await apiPut('/generos/' + id, body);
      toast('Género actualizado ✔');
    } else {
      await apiPost('/generos', body);
      toast('Género creado ✔');
    }
    closeModal();
    loadGeneros();
    if (currentSection === 'dashboard') loadDashboard();
  } catch (e) { toast(e.message, 'error'); }
}

function editGenero(g) {
  openModal('Editar Género', formGenero(g), () => saveGenero(g.id));
}

function delGenero(id, nombre) {
  confirm(`¿Eliminar el género "${nombre}"?`, async () => {
    try {
      await apiDel('/generos/' + id);
      toast('Género eliminado');
      loadGeneros();
    } catch (e) { toast(e.message, 'error'); }
  });
}

/* ════════════════════════════════════════════════════
   DIRECTORES
   ════════════════════════════════════════════════════ */

async function loadDirectores() {
  const tbody = document.querySelector('#table-directores tbody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Cargando...</td></tr>';
  try {
    const res = await apiGet('/directores');
    const rows = (res.data || res || []);
    if (rows.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Sin registros</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(d => `
      <tr>
        <td>${d.id}</td>
        <td><strong>${escHtml(d.nombres)}</strong></td>
        <td><span class="badge badge-${(d.estado||'').toLowerCase()}">${escHtml(d.estado)}</span></td>
        <td>${fmtDate(d.createdAt)}</td>
        <td>${fmtDate(d.updatedAt)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="Editar" onclick='editDirector(${JSON.stringify(d)})'>✏️</button>
            <button class="btn-icon del" title="Eliminar" onclick="delDirector(${d.id},'${escHtml(d.nombres)}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Error: ' + escHtml(e.message) + '</td></tr>';
  }
}

document.getElementById('btn-new-director').addEventListener('click', () => {
  openModal('Nuevo Director', formDirector(), saveDirector);
});

function formDirector(d = {}) {
  return `
    <div class="form-group">
      <label>Nombres completos *</label>
      <input id="f-nombres" class="input-field" value="${escHtml(d.nombres||'')}" placeholder="Ej: Steven Spielberg" />
    </div>
    <div class="form-group">
      <label>Estado</label>
      <select id="f-estado" class="input-field">
        <option value="Activo"   ${(d.estado||'Activo')==='Activo'?'selected':''}>Activo</option>
        <option value="Inactivo" ${d.estado==='Inactivo'?'selected':''}>Inactivo</option>
      </select>
    </div>`;
}

async function saveDirector(id) {
  const body = {
    nombres: document.getElementById('f-nombres').value.trim(),
    estado:  document.getElementById('f-estado').value,
  };
  if (!body.nombres) { toast('Los nombres son requeridos', 'warning'); return; }
  try {
    if (id) {
      await apiPut('/directores/' + id, body);
      toast('Director actualizado ✔');
    } else {
      await apiPost('/directores', body);
      toast('Director creado ✔');
    }
    closeModal();
    loadDirectores();
  } catch (e) { toast(e.message, 'error'); }
}

function editDirector(d) {
  openModal('Editar Director', formDirector(d), () => saveDirector(d.id));
}

function delDirector(id, nombres) {
  confirm(`¿Eliminar al director "${nombres}"?`, async () => {
    try {
      await apiDel('/directores/' + id);
      toast('Director eliminado');
      loadDirectores();
    } catch (e) { toast(e.message, 'error'); }
  });
}

/* ════════════════════════════════════════════════════
   PRODUCTORAS
   ════════════════════════════════════════════════════ */

async function loadProductoras() {
  const tbody = document.querySelector('#table-productoras tbody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Cargando...</td></tr>';
  try {
    const res = await apiGet('/productoras');
    const rows = (res.data || res || []);
    if (rows.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Sin registros</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(p => `
      <tr>
        <td>${p.id}</td>
        <td><strong>${escHtml(p.nombre)}</strong></td>
        <td><span class="badge badge-${(p.estado||'').toLowerCase()}">${escHtml(p.estado)}</span></td>
        <td class="truncate">${escHtml(p.slogan)}</td>
        <td class="truncate">${escHtml(p.descripcion)}</td>
        <td>${fmtDate(p.createdAt)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="Editar" onclick='editProductora(${JSON.stringify(p)})'>✏️</button>
            <button class="btn-icon del" title="Eliminar" onclick="delProductora(${p.id},'${escHtml(p.nombre)}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Error: ' + escHtml(e.message) + '</td></tr>';
  }
}

document.getElementById('btn-new-productora').addEventListener('click', () => {
  openModal('Nueva Productora', formProductora(), saveProductora);
});

function formProductora(p = {}) {
  return `
    <div class="form-group">
      <label>Nombre *</label>
      <input id="f-nombre" class="input-field" value="${escHtml(p.nombre||'')}" placeholder="Ej: Warner Bros" />
    </div>
    <div class="form-group">
      <label>Estado</label>
      <select id="f-estado" class="input-field">
        <option value="Activo"   ${(p.estado||'Activo')==='Activo'?'selected':''}>Activo</option>
        <option value="Inactivo" ${p.estado==='Inactivo'?'selected':''}>Inactivo</option>
      </select>
    </div>
    <div class="form-group">
      <label>Slogan</label>
      <input id="f-slogan" class="input-field" value="${escHtml(p.slogan||'')}" placeholder="Ej: The one to watch" />
    </div>
    <div class="form-group">
      <label>Descripción</label>
      <textarea id="f-descripcion" class="input-field">${escHtml(p.descripcion||'')}</textarea>
    </div>`;
}

async function saveProductora(id) {
  const body = {
    nombre:      document.getElementById('f-nombre').value.trim(),
    estado:      document.getElementById('f-estado').value,
    slogan:      document.getElementById('f-slogan').value.trim(),
    descripcion: document.getElementById('f-descripcion').value.trim(),
  };
  if (!body.nombre) { toast('El nombre es requerido', 'warning'); return; }
  try {
    if (id) {
      await apiPut('/productoras/' + id, body);
      toast('Productora actualizada ✔');
    } else {
      await apiPost('/productoras', body);
      toast('Productora creada ✔');
    }
    closeModal();
    loadProductoras();
  } catch (e) { toast(e.message, 'error'); }
}

function editProductora(p) {
  openModal('Editar Productora', formProductora(p), () => saveProductora(p.id));
}

function delProductora(id, nombre) {
  confirm(`¿Eliminar la productora "${nombre}"?`, async () => {
    try {
      await apiDel('/productoras/' + id);
      toast('Productora eliminada');
      loadProductoras();
    } catch (e) { toast(e.message, 'error'); }
  });
}

/* ════════════════════════════════════════════════════
   TIPOS
   ════════════════════════════════════════════════════ */

async function loadTipos() {
  const tbody = document.querySelector('#table-tipos tbody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Cargando...</td></tr>';
  try {
    const res = await apiGet('/tipos');
    const rows = (res.data || res || []);
    if (rows.length === 0) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Sin registros</td></tr>';
      return;
    }
    tbody.innerHTML = rows.map(t => `
      <tr>
        <td>${t.id}</td>
        <td><strong>${escHtml(t.nombre)}</strong></td>
        <td class="truncate">${escHtml(t.descripcion)}</td>
        <td>${fmtDate(t.createdAt)}</td>
        <td>${fmtDate(t.updatedAt)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="Editar" onclick='editTipo(${JSON.stringify(t)})'>✏️</button>
            <button class="btn-icon del" title="Eliminar" onclick="delTipo(${t.id},'${escHtml(t.nombre)}')">🗑️</button>
          </div>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="6">Error: ' + escHtml(e.message) + '</td></tr>';
  }
}

document.getElementById('btn-new-tipo').addEventListener('click', () => {
  openModal('Nuevo Tipo', formTipo(), saveTipo);
});

function formTipo(t = {}) {
  return `
    <div class="form-group">
      <label>Nombre *</label>
      <input id="f-nombre" class="input-field" value="${escHtml(t.nombre||'')}" placeholder="Ej: Película, Serie" />
    </div>
    <div class="form-group">
      <label>Descripción</label>
      <textarea id="f-descripcion" class="input-field">${escHtml(t.descripcion||'')}</textarea>
    </div>`;
}

async function saveTipo(id) {
  const body = {
    nombre:      document.getElementById('f-nombre').value.trim(),
    descripcion: document.getElementById('f-descripcion').value.trim(),
  };
  if (!body.nombre) { toast('El nombre es requerido', 'warning'); return; }
  try {
    if (id) {
      await apiPut('/tipos/' + id, body);
      toast('Tipo actualizado ✔');
    } else {
      await apiPost('/tipos', body);
      toast('Tipo creado ✔');
    }
    closeModal();
    loadTipos();
  } catch (e) { toast(e.message, 'error'); }
}

function editTipo(t) {
  openModal('Editar Tipo', formTipo(t), () => saveTipo(t.id));
}

function delTipo(id, nombre) {
  confirm(`¿Eliminar el tipo "${nombre}"?`, async () => {
    try {
      await apiDel('/tipos/' + id);
      toast('Tipo eliminado');
      loadTipos();
    } catch (e) { toast(e.message, 'error'); }
  });
}

/* ════════════════════════════════════════════════════
   MEDIA
   ════════════════════════════════════════════════════ */

let _mediaAll = [];
let _tiposAll = [];
let _generosAll = [];

async function loadMedia() {
  const tbody = document.querySelector('#table-media tbody');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="10">Cargando...</td></tr>';
  try {
    const [res, tipos, generos] = await Promise.all([
      apiGet('/media'),
      apiGet('/tipos'),
      apiGet('/generos'),
    ]);
    _mediaAll   = res.data   || res   || [];
    _tiposAll   = tipos.data || tipos || [];
    _generosAll = generos.data || generos || [];

    // Llenar filtros
    const ftipo   = document.getElementById('filter-tipo');
    const fgenero = document.getElementById('filter-genero');
    const prevTipo   = ftipo.value;
    const prevGenero = fgenero.value;

    ftipo.innerHTML   = '<option value="">Todos los tipos</option>' +
      _tiposAll.map(t => `<option value="${t.id}" ${prevTipo == t.id ? 'selected':''}>${escHtml(t.nombre)}</option>`).join('');
    fgenero.innerHTML = '<option value="">Todos los géneros</option>' +
      _generosAll.map(g => `<option value="${g.id}" ${prevGenero == g.id ? 'selected':''}>${escHtml(g.nombre)}</option>`).join('');

    renderMedia();
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="10">Error: ' + escHtml(e.message) + '</td></tr>';
  }
}

function renderMedia() {
  const tbody  = document.querySelector('#table-media tbody');
  const search = document.getElementById('filter-search').value.toLowerCase();
  const tipo   = document.getElementById('filter-tipo').value;
  const genero = document.getElementById('filter-genero').value;

  let filtered = _mediaAll;
  if (tipo)   filtered = filtered.filter(m => String(m.tipo_id) === String(tipo));
  if (genero) filtered = filtered.filter(m => String(m.genero_id) === String(genero));
  if (search) filtered = filtered.filter(m => (m.titulo||'').toLowerCase().includes(search));

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="10">Sin resultados</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(m => `
    <tr>
      <td>${m.id}</td>
      <td>${escHtml(m.serial)}</td>
      <td>
        <button class="btn-icon view" title="Ver detalle" onclick='showMediaDetail(${JSON.stringify(m)})'>
          ${escHtml(m.titulo)}
        </button>
      </td>
      <td>${escHtml(m.tipo_nombre || m.tipo || '')}</td>
      <td>${escHtml(m.genero_nombre || m.genero || '')}</td>
      <td>${escHtml(m.director_nombres || m.director || '')}</td>
      <td>${escHtml(m.productora_nombre || m.productora || '')}</td>
      <td>${escHtml(m.anio_estreno)}</td>
      <td class="truncate">
        ${m.url ? `<a href="${escHtml(m.url)}" target="_blank" rel="noopener">🔗 Link</a>` : '—'}
      </td>
      <td>
        <div class="actions">
          <button class="btn-icon" title="Editar" onclick='editMedia(${JSON.stringify(m)})'>✏️</button>
          <button class="btn-icon del" title="Eliminar" onclick="delMedia(${m.id},'${escHtml(m.titulo)}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

// Filtros reactivos
['filter-tipo','filter-genero','filter-search'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderMedia);
});

/* ── Formulario Media ─────────────────────────────── */
document.getElementById('btn-new-media').addEventListener('click', async () => {
  const html = await buildMediaForm({});
  openModal('Nueva Producción', html, () => saveMedia());
});

async function buildMediaForm(m) {
  const [generosA, directoresA, productorasA, tipos] = await Promise.all([
    apiGet('/generos/activos'),
    apiGet('/directores/activos'),
    apiGet('/productoras/activas'),
    apiGet('/tipos'),
  ]);

  const ga = generosA.data    || generosA    || [];
  const da = directoresA.data || directoresA || [];
  const pa = productorasA.data|| productorasA|| [];
  const ta = tipos.data       || tipos       || [];

  const opts = (arr, idField, nameField, sel) =>
    arr.map(x => `<option value="${x.id}" ${x.id == sel ? 'selected':''}>${escHtml(x[nameField])}</option>`).join('');

  return `
    <div class="form-row">
      <div class="form-group">
        <label>Serial único *</label>
        <input id="f-serial" class="input-field" value="${escHtml(m.serial||'')}" placeholder="Ej: MOV-001" />
      </div>
      <div class="form-group">
        <label>Año de estreno</label>
        <input id="f-anio" class="input-field" type="number" min="1900" max="2100" value="${escHtml(m.anio_estreno||'')}" placeholder="2024" />
      </div>
    </div>
    <div class="form-group">
      <label>Título *</label>
      <input id="f-titulo" class="input-field" value="${escHtml(m.titulo||'')}" placeholder="Título de la producción" />
    </div>
    <div class="form-group">
      <label>Sinopsis</label>
      <textarea id="f-sinopsis" class="input-field">${escHtml(m.sinopsis||'')}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Tipo *</label>
        <select id="f-tipo" class="input-field">
          <option value="">— Seleccionar —</option>
          ${opts(ta,'id','nombre', m.tipo_id)}
        </select>
      </div>
      <div class="form-group">
        <label>Género (Activos) *</label>
        <select id="f-genero" class="input-field">
          <option value="">— Seleccionar —</option>
          ${opts(ga,'id','nombre', m.genero_id)}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Director (Activos) *</label>
        <select id="f-director" class="input-field">
          <option value="">— Seleccionar —</option>
          ${opts(da,'id','nombres', m.director_id)}
        </select>
      </div>
      <div class="form-group">
        <label>Productora (Activas) *</label>
        <select id="f-productora" class="input-field">
          <option value="">— Seleccionar —</option>
          ${opts(pa,'id','nombre', m.productora_id)}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>URL del contenido *</label>
      <input id="f-url" class="input-field" value="${escHtml(m.url||'')}" placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>URL de portada (imagen)</label>
      <input id="f-portada" class="input-field" value="${escHtml(m.portada||'')}" placeholder="https://..." />
    </div>`;
}

async function saveMedia(id) {
  const body = {
    serial:       document.getElementById('f-serial').value.trim(),
    titulo:       document.getElementById('f-titulo').value.trim(),
    sinopsis:     document.getElementById('f-sinopsis').value.trim(),
    anio_estreno: document.getElementById('f-anio').value.trim(),
    url:          document.getElementById('f-url').value.trim(),
    portada:      document.getElementById('f-portada').value.trim(),
    tipo_id:      Number(document.getElementById('f-tipo').value),
    genero_id:    Number(document.getElementById('f-genero').value),
    director_id:  Number(document.getElementById('f-director').value),
    productora_id:Number(document.getElementById('f-productora').value),
  };
  if (!body.serial) { toast('El serial es requerido', 'warning'); return; }
  if (!body.titulo) { toast('El título es requerido', 'warning'); return; }
  if (!body.url)    { toast('La URL es requerida', 'warning'); return; }
  if (!body.tipo_id)        { toast('Selecciona un tipo', 'warning'); return; }
  if (!body.genero_id)      { toast('Selecciona un género', 'warning'); return; }
  if (!body.director_id)    { toast('Selecciona un director', 'warning'); return; }
  if (!body.productora_id)  { toast('Selecciona una productora', 'warning'); return; }

  try {
    if (id) {
      await apiPut('/media/' + id, body);
      toast('Producción actualizada ✔');
    } else {
      await apiPost('/media', body);
      toast('Producción creada ✔');
    }
    closeModal();
    loadMedia();
    if (currentSection === 'dashboard') loadDashboard();
  } catch (e) { toast(e.message, 'error'); }
}

async function editMedia(m) {
  try {
    const html = await buildMediaForm(m);
    openModal('Editar Producción', html, () => saveMedia(m.id));
  } catch (e) { toast(e.message, 'error'); }
}

function delMedia(id, titulo) {
  confirm(`¿Eliminar "${titulo}"?`, async () => {
    try {
      await apiDel('/media/' + id);
      toast('Producción eliminada');
      loadMedia();
      if (currentSection === 'dashboard') loadDashboard();
    } catch (e) { toast(e.message, 'error'); }
  });
}

/* ── Detalle Media ────────────────────────────────── */
function showMediaDetail(m) {
  const posterHtml = m.portada
    ? `<div class="detail-poster"><img src="${escHtml(m.portada)}" alt="${escHtml(m.titulo)}" onerror="this.parentElement.innerHTML='🎞️'" /></div>`
    : `<div class="detail-poster" style="display:flex;align-items:center;justify-content:center">🎞️</div>`;

  const html = `
    <div class="detail-grid">
      ${posterHtml}
      <div class="detail-field">
        <label>Serial</label><span>${escHtml(m.serial)}</span>
      </div>
      <div class="detail-field">
        <label>Año</label><span>${escHtml(m.anio_estreno)||'—'}</span>
      </div>
      <div class="detail-field">
        <label>Tipo</label><span>${escHtml(m.tipo_nombre||m.tipo||'—')}</span>
      </div>
      <div class="detail-field">
        <label>Género</label><span>${escHtml(m.genero_nombre||m.genero||'—')}</span>
      </div>
      <div class="detail-field">
        <label>Director</label><span>${escHtml(m.director_nombres||m.director||'—')}</span>
      </div>
      <div class="detail-field">
        <label>Productora</label><span>${escHtml(m.productora_nombre||m.productora||'—')}</span>
      </div>
      <div class="detail-field full">
        <label>Sinopsis</label><span>${escHtml(m.sinopsis)||'Sin sinopsis registrada.'}</span>
      </div>
      <div class="detail-field full">
        <label>URL</label>
        <span>${m.url ? `<a href="${escHtml(m.url)}" target="_blank" rel="noopener">${escHtml(m.url)}</a>` : '—'}</span>
      </div>
      <div class="detail-field">
        <label>Creado</label><span>${fmtDate(m.createdAt)}</span>
      </div>
      <div class="detail-field">
        <label>Actualizado</label><span>${fmtDate(m.updatedAt)}</span>
      </div>
    </div>`;

  openDetail(escHtml(m.titulo), html);
}

/* ════════════════════════════════════════════════════
   INICIALIZACIÓN
   ════════════════════════════════════════════════════ */

showSection('dashboard');
