const classState = {
  lessons: [],
  grammar: { level: 'All levels', ageGroup: 'all' },
  vocabulary: { level: 'All levels', ageGroup: 'all' },
  conversation: { level: 'All levels', ageGroup: 'all' }
};

const imageFallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=80';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[c]));

function renderClassFilters(classType) {
  const levels = ['All levels', 'B1', 'B2', 'C1'];
  const ageGroups = ['all', 'adults', 'teens'];
  const state = classState[classType];

  const html = [
    ...levels.map(level => `<button class="${state.level === level ? 'selected' : ''}" data-level="${level}" type="button">${level}</button>`),
    '<span class="divider" aria-hidden="true"></span>',
    ...ageGroups.map(age => {
      const label = age === 'all' ? 'All ages' : age.charAt(0).toUpperCase() + age.slice(1);
      return `<button class="${state.ageGroup === age ? 'selected' : ''}" data-age="${age}" type="button">${label}</button>`;
    })
  ].join('');

  const container = document.querySelector(`#${classType}Filters`);
  if (!container) return;

  container.innerHTML = html;

  container.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.level) {
        state.level = button.dataset.level;
      }

      if (button.dataset.age !== undefined) {
        state.ageGroup = button.dataset.age;
      }

      renderClassFilters(classType);
      renderClassGrid(classType);
    });
  });
}

function renderClassGrid(classType) {
  const state = classState[classType];
  const filtered = classState.lessons.filter(lesson => {
    const classMatches = lesson.classType === classType;
    const levelMatches = state.level === 'All levels' || lesson.level === state.level;
    const ageMatches = state.ageGroup === 'all' || (lesson.ageGroup === state.ageGroup);

    return classMatches && levelMatches && ageMatches;
  });

  const lessonHtml = filtered.map(lesson => `<article class="lesson-card"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener"><div class="thumb" style="background-image:url('${esc(lesson.image || imageFallback)}')"></div></a><div class="card-body"><h3>${esc(lesson.title)}</h3><p><span>${esc(lesson.level)}</span><span>${esc(lesson.ageGroup || 'General')}</span><span>${esc(lesson.date)}</span></p><p class="description">${esc(lesson.description)}</p><div class="card-links"><a href="${esc(lesson.presentation)}" target="_blank" rel="noopener">Presentation →</a><a href="${esc(lesson.worksheet)}" target="_blank" rel="noopener" download>Worksheet ↓</a></div></div></article>`).join('');

  const container = document.querySelector(`#${classType}Grid`);
  if (container) {
    container.innerHTML = lessonHtml || '<p style="text-align:center;color:#999;padding:40px;">No lessons match those filters.</p>';
  }
}

async function init() {
  try {
    const response = await fetch('lessons.json');
    classState.lessons = await response.json();

    renderClassFilters('grammar');
    renderClassGrid('grammar');

    renderClassFilters('vocabulary');
    renderClassGrid('vocabulary');

    renderClassFilters('conversation');
    renderClassGrid('conversation');
  } catch (error) {
    console.error('Error loading lessons:', error);
  }
}

document.querySelector('#searchButton')?.addEventListener('click', () => {
  const query = prompt('Search lesson titles:');
  if (!query) return;

  const match = classState.lessons.find(lesson => lesson.title.toLowerCase().includes(query.toLowerCase()));
  if (match) {
    const sectionId = `${match.classType}Section`;
    const section = document.querySelector(`#${sectionId}`);
    if (section) section.scrollIntoView();
  } else {
    alert('No lesson found.');
  }
});

init();
