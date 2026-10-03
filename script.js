const state = {
  lessons: []
};

const imageFallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=80';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[c]));

function lessonMeta(lesson) {
  return `<span>${esc(lesson.level)}</span><span>${esc(lesson.topic)}</span><span>${esc(lesson.date)}</span>`;
}

function renderLatest() {
  const lesson = state.lessons[0];
  if (!lesson) return;

  document.querySelector('#today').innerHTML = `<div class="today-copy"><span class="pill">LATEST CLASS</span><h2>${esc(lesson.title)}</h2><div class="meta">${lessonMeta(lesson)}</div><p>${esc(lesson.description)}</p><div class="actions"><a class="button" href="${esc(lesson.presentation)}" target="_blank" rel="noopener">▶ View presentation</a><a class="button outline" href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>⇩ Download worksheet</a></div></div><a class="lesson-image" href="${esc(lesson.presentation)}" target="_blank" rel="noopener" style="background-image:linear-gradient(90deg,rgba(0,30,60,.3),rgba(0,30,60,.05)),url('${esc(lesson.image || imageFallback)}')" aria-label="Open ${esc(lesson.title)} presentation"></a>`;
}

function renderGrid() {
  const newsOnly = state.lessons.filter((lesson, index) => index > 0 && !lesson.classType);

  const lessonHtml = newsOnly.map(lesson => `<article class="lesson-card"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener"><div class="thumb" style="background-image:url('${esc(lesson.image || imageFallback)}')"></div></a><div class="card-body"><h3>${esc(lesson.title)}</h3><p><span>${esc(lesson.level)}</span><span>${esc(lesson.topic)}</span><span>${esc(lesson.date)}</span></p><div class="card-links"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener">Presentation →</a><a href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>Worksheet ↓</a></div></div></article>`).join('');

  document.querySelector('#lessonGrid').innerHTML = lessonHtml;
  document.querySelector('#noResults').hidden = newsOnly.length > 0;
}

async function init() {
  try {
    const response = await fetch('lessons.json');
    state.lessons = await response.json();
    renderLatest();
    renderGrid();
  } catch (error) {
    document.querySelector('#today').innerHTML = '<p>Lessons could not be loaded. Please try again shortly.</p>';
    console.error(error);
  }
}

document.querySelector('#searchButton').addEventListener('click', () => {
  const query = prompt('Search lesson titles:');
  if (!query) return;

  const match = state.lessons.find(lesson => lesson.title.toLowerCase().includes(query.toLowerCase()));
  if (match) {
    document.querySelector('#latest').scrollIntoView();
  } else {
    alert('No lesson found.');
  }
});

init();
