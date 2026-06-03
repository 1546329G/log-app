const API_LOGS = '/api/logs';
const API_STATS = '/api/stats';
const refreshButton = document.getElementById('refreshButton');
const logsBody = document.getElementById('logsBody');
const totalLogs = document.getElementById('totalLogs');
const totalErrors = document.getElementById('totalErrors');
const serviceRestarts = document.getElementById('serviceRestarts');
const photosDetected = document.getElementById('photosDetected');
const photosCopied = document.getElementById('photosCopied');
const copyFailures = document.getElementById('copyFailures');

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
  params.set('limit', '100');
  return params;
}

async function loadStats() {
  try {
    const response = await fetch(API_STATS);
    const result = await response.json();
    if (!result.success) return;
    totalLogs.textContent = result.data.total_logs;
    totalErrors.textContent = result.data.total_errors;
    serviceRestarts.textContent = result.data.service_restarts;
    photosDetected.textContent = result.data.photos_detected;
    photosCopied.textContent = result.data.photos_copied;
    copyFailures.textContent = result.data.copy_failures;
  } catch (error) {
    console.error(error);
  }
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
      .map((log) => `<tr>
        <td>${new Date(log.created_at).toLocaleString()}</td>
        <td>${log.level}</td>
        <td>${log.module}</td>
        <td>${log.event}</td>
        <td>${escapeHtml(log.message)}</td>
        <td>${escapeHtml(log.device_model || '')}</td>
        <td>${escapeHtml(log.android_version || '')}</td>
        <td>${escapeHtml(log.app_version || '')}</td>
        <td>${log.battery_level ?? ''}%</td>
      </tr>`)
      .join('');
  } catch (error) {
    console.error(error);
  }
}

function escapeHtml(value) {
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
