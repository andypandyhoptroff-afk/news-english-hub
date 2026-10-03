const state = {
  lessons: [],
  level: 'All levels',
  topic: 'All topics'
};

const topics = ['Politics', 'Sport', 'Science', 'Environment', 'Business', 'Culture', 'Technology', 'Health'];
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

function renderToday() {
  const newsLessons = state.lessons.filter((lesson, index) => index > 0 && !lesson.classType);
  const lesson = newsLessons[0];
  
  if (!lesson) return;

  document.querySelector('#today').innerHTML = `<div class="today-copy"><span class="pill">LATEST CLASS</span><h2>${esc(lesson.title)}</h2><div class="meta">${lessonMeta(lesson)}</div><p>${esc(lesson.description)}</p><div class="actions"><a class="button" href="${esc(lesson.presentation)}" target="_blank" rel="noopener">▶ View presentation</a><a class="button outline" href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>⇩ Download worksheet</a></div></div><div class="lesson-image" style="background-image:url('${esc(lesson.image || imageFallback)}')"></div>`;
}

function renderFilters() {
  const levels = ['All levels', 'B1', 'B2', 'C1'];

  const html = [
    ...levels.map(level => `<button class="${state.level === level ? 'selected' : ''}" data-level="${level}" type="button">${level}</button>`),
    '<span class="divider" aria-hidden="true"></span>',
    ...topics.map(topic => `<button class="${state.topic === topic ? 'selected' : ''}" data-topic="${topic}" type="button">${topic}</button>`)
  ].join('');

  document.querySelector('#filters').innerHTML = html;

  document.querySelectorAll('#filters button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.level) {
        state.level = button.dataset.level;
      }

      if (button.dataset.topic) {
        state.topic = state.topic === button.dataset.topic ? 'All topics' : button.dataset.topic;
      }

      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const filtered = state.lessons.filter((lesson, index) => {
    const isNews = index > 0 && !lesson.classType;
    const levelMatches = state.level === 'All levels' || lesson.level === state.level;
    const topicMatches = state.topic === 'All topics' || lesson.topic === state.topic;

    return isNews && levelMatches && topicMatches;
  });

  const lessonHtml = filtered.map(lesson => `<article class="lesson-card"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener"><div class="thumb" style="background-image:url('${esc(lesson.image || imageFallback)}')"></div></a><div class="card-body"><h3>${esc(lesson.title)}</h3><p><span>${esc(lesson.level)}</span><span>${esc(lesson.topic)}</span><span>${esc(lesson.date)}</span></p><div class="card-links"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener">Presentation →</a><a href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>Worksheet ↓</a></div></div></article>`).join('');

  document.querySelector('#lessonGrid').innerHTML = lessonHtml;
  document.querySelector('#noResults').hidden = filtered.length > 0;
}

async function init() {
  try {
    const response = await fetch('lessons.json');
    state.lessons = await response.json();
    renderToday();
    renderFilters();
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
