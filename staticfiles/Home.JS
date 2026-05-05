/* ── Explore Dropdown ── */
function toggleExplore() {
  document.getElementById('exploreBtn').classList.toggle('open');
  document.getElementById('exploreDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.explore-wrap');
  if (!wrap.contains(e.target)) {
    document.getElementById('exploreDropdown').classList.remove('open');
    document.querySelectorAll('.tasks-panel').forEach(p => p.classList.remove('open'));
  }
});

function showTasks(subject) {
  document.querySelectorAll('.tasks-panel').forEach(p => p.classList.remove('open'));
  const panel = document.getElementById('tasks-' + subject);
  if (panel) panel.classList.add('open');
}