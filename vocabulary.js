const state = {
  lessons: [],
  level: 'All levels',
  ageGroup: 'all'
};

const imageFallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=80';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[c]));

function renderFilters() {
  const levels = ['All levels', 'B1', 'B2', 'C1'];
  const ageGroups = ['all', 'adults', 'teens'];

  const html = [
    ...levels.map(level => `<button class="${state.level === level ? 'selected' : ''}" data-level="${level}" type="button">${level}</button>`),
    '<span class="divider" aria-hidden="true"></span>',
    ...ageGroups.map(age => {
      const label = age === 'all' ? 'All ages' : age.charAt(0).toUpperCase() + age.slice(1);
      return `<button class="${state.ageGroup === age ? 'selected' : ''}" data-age="${age}" type="button">${label}</button>`;
    })
  ].join('');

  document.querySelector('#filters').innerHTML = html;

  document.querySelectorAll('#filters button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.level) {
        state.level = button.dataset.level;
      }
      if (button.dataset.age !== undefined) {
        state.ageGroup = button.dataset.age;
      }
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const filtered = state.lessons.filter(lesson => {
    const classMatches = lesson.classType === 'vocabulary';
    const levelMatches = state.level === 'All levels' || lesson.level === state.level;
    const ageMatches = state.ageGroup === 'all' || lesson.ageGroup === state.ageGroup;
    return classMatches && levelMatches && ageMatches;
  });

  const lessonHtml = filtered.map(lesson => `<article class="lesson-card"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener"><div class="thumb" style="background-image:url('${esc(lesson.image || imageFallback)}')"></div></a><div class="card-body"><h3>${esc(lesson.title)}</h3><p><span>${esc(lesson.level)}</span><span>${esc(lesson.ageGroup || 'General')}</span><span>${esc(lesson.date)}</span></p><div class="card-links"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener">Presentation →</a><a href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>Worksheet ↓</a></div></div></article>`).join('');

  document.querySelector('#lessonGrid').innerHTML = lessonHtml || '<p style="text-align:center;color:#999;padding:40px;">No lessons match those filters.</p>';
  document.querySelector('#noResults').hidden = filtered.length > 0;
}

async function init() {
  try {
    const response = await fetch('lessons.json');
    state.lessons = await response.json();
    renderFilters();
    renderGrid();
  } catch (error) {
    console.error('Error loading lessons:', error);
  }
}

document.querySelector('#searchButton')?.addEventListener('click', () => {
  const query = prompt('Search lesson titles:');
  if (!query) return;

  const match = state.lessons.find(lesson => lesson.title.toLowerCase().includes(query.toLowerCase()) && lesson.classType === 'vocabulary');
  if (match) {
    document.querySelector('#lessonGrid').scrollIntoView();
  } else {
    alert('No vocabulary lesson found.');
  }
});

init();
