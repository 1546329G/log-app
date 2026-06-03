const API_LOGS = '/api/logs';
const API_STATS = '/api/stats';
const refreshButton = document.getElementById('refreshButton');
const logsBody = document.getElementById('logsBody');
const logCount = document.getElementById('logCount');
const totalLogs = document.getElementById('totalLogs');
const totalErrors = document.getElementById('totalErrors');
const totalWarnings = document.getElementById('totalWarnings');
const serviceRestarts = document.getElementById('serviceRestarts');
const photosDetected = document.getElementById('photosDetected');
const photosCopied = document.getElementById('photosCopied');
const copyFailures = document.getElementById('copyFailures');
const processFailures = document.getElementById('processFailures');
const rescueScans = document.getElementById('rescueScans');
const rescueRecoveries = document.getElementById('rescueRecoveries');
const bootEvents = document.getElementById('bootEvents');

function getFilters() {
  const params = new URLSearchParams();
  const level = document.getElementById('filterLevel').value;
  const module = document.getElementById('filterModule').value.trim();
  const event = document.getElementById('filterEvent').value.trim();
  const start = document.getElementById('filterStart').value;
  const end = document.getElementById('filterEnd').value;

  if (level) params.set('level', level);
  if (module) params.set('module', module);
  if (event) params.set('event', event);
  if (start) params.set('fecha_inicio', start);
  if (end) params.set('fecha_fin', end);
  params.set('limit', '200');
  return params;
}

async function loadStats() {
  try {
    const response = await fetch(API_STATS);
    const result = await response.json();
    if (!result.success) return;
    totalLogs.textContent = result.data.total_logs;
    totalErrors.textContent = result.data.total_errors;
    totalWarnings.textContent = result.data.total_warnings;
    serviceRestarts.textContent = result.data.service_restarts;
    photosDetected.textContent = result.data.photos_detected;
    photosCopied.textContent = result.data.photos_copied;
    copyFailures.textContent = result.data.copy_failures;
    processFailures.textContent = result.data.process_failures;
    rescueScans.textContent = result.data.rescue_scans;
    rescueRecoveries.textContent = result.data.rescue_recoveries;
    bootEvents.textContent = result.data.boot_events;
  } catch (error) {
    console.error(error);
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function levelBadge(level) {
  const cls = 'level-' + level;
  return `<span class="level-badge ${cls}">${level}</span>`;
}

function moduleTag(module) {
  if (!module) return '';
  return `<span class="module-tag">${escapeHtml(module)}</span>`;
}

function formatDetails(d) {
  if (!d || typeof d !== 'object') return '';
  const parts = [];
  if (d.uri) parts.push('<strong>URI:</strong> ' + d.uri);
  if (d.fileName) parts.push('<strong>Archivo:</strong> ' + d.fileName);
  if (d.error) parts.push('<strong>Error:</strong> ' + d.error);
  if (d.attempt) parts.push('<strong>Intento:</strong> ' + d.attempt);
  if (d.enqueued) parts.push('<strong>Encoladas:</strong> ' + d.enqueued);
  if (d.source) parts.push('<strong>Origen:</strong> ' + d.source);
  if (d.size) parts.push('<strong>Tamaño:</strong> ' + d.size);
  return parts.join('<br>');
}

async function loadLogs() {
  try {
    const params = getFilters();
    const response = await fetch(`${API_LOGS}?${params.toString()}`);
    const result = await response.json();
    if (!result.success) return;
    const search = document.getElementById('searchText').value.trim().toLowerCase();
    const logs = result.data.filter((log) => {
      if (!search) return true;
      return [
        log.message,
        log.module,
        log.event,
        log.device_model,
        log.android_version,
        log.app_version,
        log.photo_uri,
        log.file_path,
      ].some((value) => value && value.toString().toLowerCase().includes(search));
    });
    logsBody.innerHTML = logs
      .map((log) => {
        let details = '';
        try {
          details = formatDetails(log.details_json);
        } catch (e) {}
        return `<tr>
          <td style="white-space:nowrap;font-size:0.78rem;color:var(--text-muted)">${formatDate(log.created_at)}</td>
          <td>${levelBadge(log.level)}</td>
          <td>${moduleTag(log.module)}</td>
          <td><span class="event-cell">${escapeHtml(log.event)}</span></td>
          <td style="max-width:200px">${escapeHtml(log.message)}</td>
          <td class="details-cell">${details}</td>
          <td style="font-size:0.78rem">${escapeHtml(log.device_model || '')}</td>
          <td style="font-size:0.78rem;text-align:center">${escapeHtml(log.android_version || '')}</td>
          <td style="text-align:center;font-weight:600;font-size:0.8rem">${log.battery_level ?? ''}<span style="color:var(--text-muted);font-weight:400">${log.battery_level != null ? '%' : ''}</span></td>
        </tr>`;
      })
      .join('');
    if (logCount) {
      logCount.textContent = logs.length + ' registros';
    }
  } catch (error) {
    console.error(error);
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function refresh() {
  loadStats();
  loadLogs();
}

refreshButton.addEventListener('click', refresh);
setInterval(refresh, 5000);
refresh();
