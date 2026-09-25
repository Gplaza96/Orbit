const seedData = {
  tasks: [
    { id: 1, title: 'Map the request from button to database', tag: 'Architecture', meta: '15 min read', done: true },
    { id: 2, title: 'Build a REST endpoint with pagination', tag: 'Backend', meta: '45 min practice', done: true },
    { id: 3, title: 'Understand state and derived UI in React', tag: 'Frontend', meta: '30 min practice', done: false },
    { id: 4, title: 'Open a pull request with a useful description', tag: 'Workflow', meta: '20 min practice', done: false }
  ],
  notes: [
    { id: 1, body: 'A good API is a conversation: resources, verbs, and a predictable answer.', age: 'Today, 10:24 AM' },
    { id: 2, body: 'The fastest way to learn a framework is to make one tiny thing with it.', age: 'Yesterday, 3:40 PM' }
  ],
  studySets: [],
  helpCases: []
};

const defaultPreferences = { theme: 'light', customColors: false, paper: '#f4f1ea', surface: '#fffdf8', ink: '#17221e', mint: '#afdcc8', noteSize: '16px' };
const standardPalettes = { light: { paper: '#f4f1ea', surface: '#fffdf8', ink: '#17221e', mint: '#afdcc8', mintDark: '#197050' }, dark: { paper: '#16201c', surface: '#202d27', ink: '#eef5ef', mint: '#2d6952', mintDark: '#9de0be' } };
const lessons = [
  { id: 'html', title: 'HTML basics', source: 'https://www.w3schools.com/html/', questions: [{ prompt: 'Which HTML element is used for the largest heading?', answer: '<h1>', hint: 'It is the first heading level.' }, { prompt: 'Which attribute provides alternative text for an image?', answer: 'alt', hint: 'It helps describe an image when it cannot be seen.' }] },
  { id: 'css', title: 'CSS selectors', source: 'https://www.w3schools.com/css/css_selectors.asp', questions: [{ prompt: 'Which selector targets an element with the id "main"?', answer: '#main', hint: 'An id selector starts with a hash.' }, { prompt: 'Which CSS property changes text color?', answer: 'color', hint: 'It is not background-color.' }] },
  { id: 'javascript', title: 'JavaScript basics', source: 'https://www.w3schools.com/js/', questions: [{ prompt: 'Which keyword declares a block-scoped variable that can be reassigned?', answer: 'let', hint: 'It is one of JavaScript\'s three common declaration keywords.' }, { prompt: 'Which method converts a JSON string into a JavaScript value?', answer: 'JSON.parse()', hint: 'The method name includes the word parse.' }] },
  { id: 'python', title: 'Python basics', source: 'https://www.w3schools.com/python/', questions: [{ prompt: 'Which keyword defines a function in Python?', answer: 'def', hint: 'It is the first word before a function name.' }, { prompt: 'Which Python collection stores ordered, changeable values?', answer: 'list', hint: 'It is commonly written with square brackets.' }] },
  { id: 'java', title: 'Java basics', source: 'https://www.w3schools.com/java/', questions: [{ prompt: 'Which keyword creates a class in Java?', answer: 'class', hint: 'It appears before the class name.' }, { prompt: 'Which method is the entry point of a Java application?', answer: 'main', hint: 'It is commonly written as public static void ...' }] },
  { id: 'cpp', title: 'C++ basics', source: 'https://www.w3schools.com/cpp/', questions: [{ prompt: 'Which symbol starts a single-line comment in C++?', answer: '//', hint: 'It uses two forward slashes.' }, { prompt: 'Which stream is commonly used to print output in C++?', answer: 'cout', hint: 'It belongs to the std namespace.' }] },
  { id: 'csharp', title: 'C# basics', source: 'https://www.w3schools.com/cs/', questions: [{ prompt: 'Which keyword declares a class in C#?', answer: 'class', hint: 'It appears before the class name.' }, { prompt: 'Which method writes text to the console in C#?', answer: 'Console.WriteLine', hint: 'It belongs to the Console class.' }] },
  { id: 'react', title: 'React basics', source: 'https://www.w3schools.com/react/', questions: [{ prompt: 'Which hook stores local component state?', answer: 'useState', hint: 'It starts with use and ends with State.' }, { prompt: 'What prop helps React identify items in a rendered list?', answer: 'key', hint: 'It is a short three-letter prop.' }] },
  { id: 'math', title: 'Mathematics foundations', source: 'https://www.khanacademy.org/math', questions: [{ prompt: 'What is the value of 3 squared?', answer: '9', hint: 'Multiply 3 by itself.' }, { prompt: 'What is the slope of a horizontal line?', answer: '0', hint: 'It has no rise.' }] },
  { id: 'history', title: 'History foundations', source: 'https://www.britannica.com/', questions: [{ prompt: 'Which ancient civilization built Machu Picchu?', answer: 'Inca', hint: 'It was centered in the Andes.' }, { prompt: 'Which document begins with "We the People"?', answer: 'The Constitution', hint: 'It is the founding document of the United States government.' }] }
];

const api = {
  getUsers() { return JSON.parse(localStorage.getItem('orbit-users') || '{}'); },
  saveUsers(users) { localStorage.setItem('orbit-users', JSON.stringify(users)); return users; },
  getCurrentUser() { const email = localStorage.getItem('orbit-current-user'); return email ? this.getUsers()[email] : null; },
  getState() { return this.getCurrentUser()?.state || structuredClone(seedData); },
  save(state) { const email = localStorage.getItem('orbit-current-user'); const users = this.getUsers(); if (!email || !users[email]) return state; users[email].state = state; this.saveUsers(users); return state; },
  getTasks(filter = 'all') { const tasks = this.getState().tasks; return filter === 'open' ? tasks.filter(task => !task.done) : filter === 'done' ? tasks.filter(task => task.done) : tasks; },
  postTask(input) { const state = this.getState(); state.tasks.push({ id: Date.now(), title: input.title, tag: input.tag, meta: 'New task', done: false }); return this.save(state); },
  patchTask(id, changes) { const state = this.getState(); const task = state.tasks.find(item => item.id === id); Object.assign(task, changes); return this.save(state); },
  deleteTask(id) { const state = this.getState(); state.tasks = state.tasks.filter(task => task.id !== id); return this.save(state); },
  postNote(body) { const state = this.getState(); state.notes.unshift({ id: Date.now(), body, age: 'Just now' }); return this.save(state); },
  postHelpCase(input) { const state = this.getState(); state.helpCases = state.helpCases || []; const helpCase = { id: Date.now(), question: input.question, code: input.code, language: input.language, screenshot: input.screenshot || '', answers: [], age: 'Just now' }; state.helpCases.unshift(helpCase); this.save(state); return helpCase; },
  postHelpAnswer(caseId, body, source) { const state = this.getState(); const helpCase = (state.helpCases || []).find(item => item.id === caseId); if (!helpCase) return null; helpCase.answers.push({ id: Date.now(), body, source, age: 'Just now' }); this.save(state); return helpCase; },
  deleteNote(id) { const state = this.getState(); state.notes = state.notes.filter(note => note.id !== id); return this.save(state); },
  postStudySet(title) { const state = this.getState(); state.studySets = state.studySets || []; const studySet = { id: Date.now(), title, questions: [], lastResult: null }; state.studySets.unshift(studySet); this.save(state); return studySet; },
  postStudyQuestion(setId, prompt, answer) { const state = this.getState(); const studySet = (state.studySets || []).find(item => item.id === setId); if (!studySet) return null; studySet.questions.push({ id: Date.now(), prompt, answer }); this.save(state); return studySet; },
  deleteStudySet(setId) { const state = this.getState(); state.studySets = (state.studySets || []).filter(item => item.id !== setId); return this.save(state); },
  reset() { this.save(structuredClone(seedData)); render(); },
  signUp(details) { const users = this.getUsers(); const email = details.email.toLowerCase(); if (users[email]) return { error: 'An account with this email already exists.' }; users[email] = { firstName: details.firstName, lastName: details.lastName, email, password: details.password, preferences: structuredClone(defaultPreferences), state: structuredClone(seedData) }; this.saveUsers(users); localStorage.setItem('orbit-current-user', email); return { user: users[email] }; },
  signIn(email, password) { const users = this.getUsers(); const user = users[email.toLowerCase()]; if (!user || user.password !== password) return { error: 'Email or password is incorrect.' }; localStorage.setItem('orbit-current-user', user.email); return { user }; },
  updateProfile(changes) { const user = this.getCurrentUser(); if (!user) return { error: 'Please sign in first.' }; const users = this.getUsers(); Object.assign(users[user.email], changes); this.saveUsers(users); return { user: users[user.email] }; },
  signOut() { localStorage.removeItem('orbit-current-user'); }
};

let activeFilter = 'all';
let requestedView = 'dashboard';
let activeLessonId = null;
let activeQuestionIndex = 0;
let quizAttempts = 0;
let activeStudySetId = null;
let studyMode = 'practice';
let studyQuestionIndex = 0;
let studyPracticeIndex = 0;
let studyScore = 0;
let studyMisses = [];
const taskList = document.querySelector('#taskList');
const noteList = document.querySelector('#noteList');
const taskDialog = document.querySelector('#taskDialog');
const settingsDialog = document.querySelector('#settingsDialog');
const authDialog = document.querySelector('#authDialog');
const toast = document.querySelector('#toast');
const learningPage = document.querySelector('#learningPage');
const notesPage = document.querySelector('#notesPage');
const studyContent = document.querySelector('#studyContent');
const offeringDialog = document.querySelector('#offeringDialog');
const offeringDialogContent = document.querySelector('#offeringDialogContent');
const helpPage = document.querySelector('#helpPage');
const caseList = document.querySelector('#caseList');
let pendingScreenshot = '';

function getPreferences() {
  const user = api.getCurrentUser();
  return { ...defaultPreferences, ...(user?.preferences || {}), ...(!user ? { theme: localStorage.getItem('orbit-theme') || defaultPreferences.theme } : {}) };
}

function applyPreferences(preferences) {
  const palette = preferences.customColors ? { ...preferences, mintDark: preferences.mint } : standardPalettes[preferences.theme] || standardPalettes.light;
  document.documentElement.dataset.theme = preferences.theme;
  document.documentElement.style.setProperty('--paper', palette.paper);
  document.documentElement.style.setProperty('--surface', palette.surface);
  document.documentElement.style.setProperty('--ink', palette.ink);
  document.documentElement.style.setProperty('--mint', palette.mint);
  document.documentElement.style.setProperty('--mint-dark', palette.mintDark);
  document.documentElement.style.setProperty('--note-size', preferences.noteSize);
  localStorage.setItem('orbit-theme', preferences.theme);
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  return hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 18 ? 'Good afternoon' : 'Good night';
}

function render() {
  const user = api.getCurrentUser();
  const state = user ? api.getState() : { tasks: [], notes: [] };
  const tasks = activeFilter === 'open' ? state.tasks.filter(task => !task.done) : activeFilter === 'done' ? state.tasks.filter(task => task.done) : state.tasks;
  taskList.innerHTML = tasks.length ? tasks.map((task, index) => `<article class="task-item" style="animation-delay:${index * 55}ms"><button class="task-check ${task.done ? 'done' : ''}" data-action="toggle" data-id="${task.id}" aria-label="${task.done ? 'Mark task open' : 'Mark task complete'}">${task.done ? '✓' : ''}</button><div><div class="task-title ${task.done ? 'done' : ''}">${escapeHtml(task.title)}</div><div class="task-meta">${task.meta}</div></div><div><span class="task-tag">${escapeHtml(task.tag)}</span><button class="task-delete" data-action="delete" data-id="${task.id}" title="Delete task" aria-label="Delete task">×</button></div></article>`).join('') : '<div class="empty-state">Nothing here yet. Add a task to keep moving.</div>';
  noteList.innerHTML = state.notes.length ? state.notes.map(note => `<article class="note-card"><p>${escapeHtml(note.body)}</p><div class="note-card-footer"><span>${escapeHtml(note.age)}</span><button class="note-delete" type="button" data-action="delete-note" data-id="${note.id}" title="Delete note" aria-label="Delete note">Delete</button></div></article>`).join('') : '<div class="notes-empty"><p>No notes to see yet.</p><button class="primary-button" type="button" data-action="add-note">Add a note</button></div>';
  const complete = state.tasks.filter(task => task.done).length;
  const total = state.tasks.length;
  const percent = total ? Math.round(complete / total * 100) : 0;
  document.querySelector('#completedCount').textContent = complete;
  document.querySelector('#totalCount').textContent = total;
  document.querySelector('#progressText').textContent = `${percent}%`;
  document.querySelector('#progressBar').style.width = `${percent}%`;
  document.querySelector('#questionCount').innerHTML = `${String(state.notes.length).padStart(2, '0')} <small>notes</small>`;
  document.querySelector('#greeting').innerHTML = user ? `${getTimeGreeting()}, ${escapeHtml(user.firstName)}<span class="accent">.</span>` : 'Your learning orbit<span class="accent">.</span>';
  document.querySelector('#userName').textContent = user ? `${user.firstName} ${user.lastName}` : 'Guest learner';
  document.querySelector('#userRole').textContent = user ? user.email : 'Sign in to save progress';
  document.querySelector('#userAvatar').textContent = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'G';
  document.querySelector('#authButton').hidden = Boolean(user);
  document.querySelector('#signOutButton').hidden = !user;
  renderQuiz(state);
  renderStudy(state);
  renderHelp(state);
  if (!user) switchView('dashboard');
}

function renderHelp(state) {
  if (!caseList) return;
  const cases = state.helpCases || [];
  document.querySelector('#caseCount').textContent = `${cases.length} case${cases.length === 1 ? '' : 's'}`;
  caseList.innerHTML = cases.length ? cases.map(item => `<article class="case-card"><div class="case-card-top"><span class="case-badge">${escapeHtml(item.language)}</span><span>${escapeHtml(item.age)}</span></div><h4>${escapeHtml(item.question)}</h4>${item.code ? `<pre><code>${escapeHtml(item.code)}</code></pre>` : ''}${item.screenshot ? `<img class="case-screenshot" src="${item.screenshot}" alt="Screenshot attached to this case" />` : ''}<div class="answer-list">${item.answers.length ? item.answers.map(answer => `<div class="case-answer ${answer.source === 'AI draft' ? 'ai-answer' : ''}"><div class="answer-label"><strong>${escapeHtml(answer.source)}</strong><span>${escapeHtml(answer.age)}</span></div><p>${escapeHtml(answer.body)}</p></div>`).join('') : '<p class="case-no-answer">No answer yet. Add a human explanation or draft one with AI.</p>'}</div><form class="case-answer-form" data-case-id="${item.id}"><label for="answer-${item.id}">Add an answer</label><textarea id="answer-${item.id}" name="answer" rows="2" maxlength="1000" placeholder="Share what worked, or add context for the next person..." required></textarea><div><select name="source" aria-label="Answer type"><option>Human answer</option><option>AI draft</option></select><button class="secondary-button" type="submit">Post answer</button><button class="text-button" type="button" data-case-action="draft" data-case-id="${item.id}">Draft with AI</button><button class="text-button" type="button" data-case-action="search" data-question="${escapeHtml(item.question)}">Find sources</button></div></form></article>`).join('') : '<div class="case-empty"><h4>Nothing stuck yet.</h4><p>Add a case with the smallest code example and a screenshot when the visual state matters.</p></div>';
}

function renderStudy(state) {
  if (!studyContent) return;
  const studySets = state.studySets || [];
  if (!studySets.length) {
    studyContent.innerHTML = '<div class="study-empty"><div><h4>Turn your syllabus into practice.</h4><p>Add a test name, then collect the questions and answers you need to know.</p></div><button class="primary-button" type="button" data-study-action="new">Create study set</button></div>';
    document.querySelector('#studyStatus').textContent = 'Build your study set';
    return;
  }
  const studySet = studySets.find(item => item.id === activeStudySetId) || studySets[0];
  activeStudySetId = studySet.id;
  if (studyMode === 'mock' && studySet.questions.length) {
    renderMockTest(studySet);
    return;
  }
  if (studyMode === 'practice-question' && studySet.questions.length) {
    renderStudyPractice(studySet);
    return;
  }
  const result = studySet.lastResult;
  document.querySelector('#studyStatus').textContent = `${studySet.questions.length} question${studySet.questions.length === 1 ? '' : 's'} ready`;
  studyContent.innerHTML = `<div class="study-set-header"><div><span class="section-kicker">Current study set</span><h4>${escapeHtml(studySet.title)}</h4><p>${studySet.questions.length ? 'Practice each answer, then try a timed-feeling mock test.' : 'Start by adding the questions your test may ask.'}</p></div>${studySet.questions.length ? '<button class="primary-button" type="button" data-study-action="mock">Start mock test</button>' : ''}</div>${result ? `<div class="study-result"><strong>Last mock:
   ${result.score}/${result.total}</strong><span>${result.score === result.total ? 'You are ready to take it.' : `Review ${result.misses.length} missed topic${result.misses.length === 1 ? '' : 's'} before your test.`}</span></div>` : ''}<div class="study-question-list">${studySet.questions.length ? studySet.questions.map((question, index) => `<article class="study-question"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${
  escapeHtml(question.prompt)}</strong><p>${escapeHtml(question.answer)}
  </p></div><button class="text-button" type="button" data-study-action="practice" data-index="${index}">Practice</button></article>`).join('') : 
  '<div class="study-placeholder">No questions yet.</div>'}</div><form class="study-add-form" id="studyQuestionForm"><div><label for="studyQuestion">Question</label><input id="studyQuestion" name="question" placeholder="What might appear on the test?" required maxlength="180" /></div><div><label for="studyAnswer">Answer</label><input id="studyAnswer" name="answer" placeholder="The answer you want to remember" required maxlength="180" /></div><button class="secondary-button" type="submit">Add question</button></form><div class="study-switcher"><label for="studySetSelect">Study set</label><select id="studySetSelect">${studySets.map(item => `<option value="${item.id}" ${item.id === studySet.id ? 'selected' : ''}>${escapeHtml(item.title)}</option>`).join('')}</select><button class="text-button" type="button" data-study-action="new">New study set</button></div>`;
  const studyHeader = document.querySelector('.study-set-header');
  if (studyHeader) { const deleteButton = document.createElement('button'); deleteButton.className = 'study-delete-button'; deleteButton.type = 'button'; deleteButton.dataset.studyAction = 'delete'; deleteButton.textContent = 'Delete study set'; studyHeader.querySelector('div').append(deleteButton); }
  const questionForm = document.querySelector('#studyQuestionForm');
  if (questionForm) questionForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); api.postStudyQuestion(studySet.id, form.get('question').trim(), form.get('answer').trim()); render(); showToast('Study question added'); });
  document.querySelector('#studySetSelect')?.addEventListener('change', event => { activeStudySetId = Number(event.target.value); studyMode = 'practice'; render(); });
}

function renderCreateStudy() {
  document.querySelector('#studyStatus').textContent = 'New study set';
  studyContent.innerHTML = '<form class="study-create-form" id="studyCreateForm"><div><label for="studyTitle">What test are you preparing for?</label><input id="studyTitle" name="title" placeholder="e.g. Biology midterm" required maxlength="80" /></div><p>Give your study set a clear name. You can add every question and answer you need next.</p><div class="study-form-actions"><button class="secondary-button" type="button" data-study-action="cancel">Cancel</button><button class="primary-button" type="submit">Create study set</button></div></form>';
  document.querySelector('#studyCreateForm').addEventListener('submit', event => { event.preventDefault(); const title = new FormData(event.currentTarget).get('title').trim(); const studySet = api.postStudySet(title); activeStudySetId = studySet.id; studyMode = 'practice'; render(); showToast('Study set created'); });
  document.querySelector('#studyTitle').focus();
}

function renderStudyPractice(studySet) {
  const question = studySet.questions[studyPracticeIndex];
  document.querySelector('#studyStatus').textContent = `Practice / ${studyPracticeIndex + 1} of ${studySet.questions.length}`;
  studyContent.innerHTML = `<div class="mock-test practice-test"><div class="quiz-topline"><span>Practice question ${studyPracticeIndex + 1} of ${studySet.questions.length}</span><button class="text-button" type="button" data-study-action="back">Back to study set</button></div><h4>${escapeHtml(question.prompt)}</h4><form class="answer-form" id="studyPracticeForm"><label class="sr-only" for="studyPracticeAnswer">Your answer</label><input id="studyPracticeAnswer" name="answer" autocomplete="off" placeholder="Try it without looking" required /><button class="primary-button" type="submit">Check answer</button></form><div class="answer-feedback" id="studyPracticeFeedback" aria-live="polite"></div></div>`;
  document.querySelector('#studyPracticeForm').addEventListener('submit', event => { event.preventDefault(); const value = new FormData(event.currentTarget).get('answer').trim().toLowerCase(); const feedback = document.querySelector('#studyPracticeFeedback'); const correct = value === question.answer.trim().toLowerCase(); feedback.innerHTML = correct ? `<div class="answer-success">Correct. ${escapeHtml(question.answer)} is the answer.</div>` : `<div class="answer-fail">Keep working on it. The answer is <strong>${escapeHtml(question.answer)}</strong>.</div><button class="text-button" type="button" data-study-action="search" data-question="${escapeHtml(question.prompt)}">Find sources for this question</button>`; feedback.insertAdjacentHTML('beforeend', `<button class="text-button" type="button" data-study-action="practice-next">${studyPracticeIndex === studySet.questions.length - 1 ? 'Back to study set' : 'Next practice question'}</button>`); });
}

function finishMockTest(studySet) {
  const state = api.getState();
  const savedSet = (state.studySets || []).find(item => item.id === studySet.id);
  if (savedSet) savedSet.lastResult = { score: studyScore, total: studySet.questions.length, misses: studyMisses.slice() };
  api.save(state);
  studyMode = 'practice';
  render();
}

function renderMockTest(studySet) {
  const question = studySet.questions[studyQuestionIndex];
  document.querySelector('#studyStatus').textContent = `Mock test / ${studyQuestionIndex + 1} of ${studySet.questions.length}`;
  studyContent.innerHTML = `<div class="mock-test"><div class="quiz-topline"><span>Mock test question ${studyQuestionIndex + 1} of ${studySet.questions.length}</span><span>${studyScore} correct</span></div><h4>${escapeHtml(question.prompt)}</h4><form class="answer-form" id="mockAnswerForm"><label class="sr-only" for="mockAnswer">Your answer</label><input id="mockAnswer" name="answer" autocomplete="off" placeholder="Answer from memory" required /><button class="primary-button" type="submit">Check answer</button></form><div class="answer-feedback" id="mockFeedback" aria-live="polite"></div></div>`;
  document.querySelector('#mockAnswerForm').addEventListener('submit', event => { event.preventDefault(); const value = new FormData(event.currentTarget).get('answer').trim().toLowerCase(); const correct = value === question.answer.trim().toLowerCase(); if (correct) studyScore += 1; else studyMisses.push(question.prompt); const feedback = document.querySelector('#mockFeedback'); feedback.innerHTML = correct ? '<div class="answer-success">Correct. Keep that answer moving.</div>' : `<div class="answer-fail">Review this one: <strong>${escapeHtml(question.answer)}</strong></div><button class="text-button" type="button" data-study-action="search" data-question="${escapeHtml(question.prompt)}">Find sources for this question</button>`; event.currentTarget.querySelector('button').disabled = true; feedback.insertAdjacentHTML('beforeend', `<button class="primary-button mock-next" type="button" data-study-action="next">${studyQuestionIndex === studySet.questions.length - 1 ? 'See my results' : 'Next question'}</button>`); });
}

function renderQuiz(state) {
  const picker = document.querySelector('#lessonPicker');
  const card = document.querySelector('#quizCard');
  if (!picker || !card) return;
  picker.innerHTML = lessons.map(lesson => `<button class="lesson-button ${activeLessonId === lesson.id ? 'active' : ''}" data-lesson="${lesson.id}">${lesson.title}</button>`).join('');
  if (!activeLessonId) { card.innerHTML = '<p class="quiz-placeholder">Choose a lesson above to test your knowledge.</p>'; document.querySelector('#quizStatus').textContent = 'Choose a lesson'; return; }
  const lesson = lessons.find(item => item.id === activeLessonId);
  const question = lesson.questions[activeQuestionIndex];
  const relatedNotes = state.notes.filter(note => note.body.toLowerCase().includes(lesson.title.split(' ')[0].toLowerCase()));
  card.innerHTML = `<div class="quiz-topline"><span>Question ${activeQuestionIndex + 1} of ${lesson.questions.length}</span><a href="${lesson.source}" target="_blank" rel="noopener">Review lesson ↗</a></div><h4>${question.prompt}</h4>${relatedNotes.length ? `<details class="quiz-notes"><summary>Your notes may help</summary>${relatedNotes.map(note => `<p>${escapeHtml(note.body)}</p>`).join('')}</details>` : ''}<form id="answerForm" class="answer-form"><label class="sr-only" for="answerInput">Your answer</label><input id="answerInput" name="answer" autocomplete="off" placeholder="Type your answer" required /><button class="primary-button" type="submit">Check answer</button></form><div id="answerFeedback" class="answer-feedback" aria-live="polite"></div>`;
  document.querySelector('#quizStatus').textContent = `${lesson.title} / ${quizAttempts} attempt${quizAttempts === 1 ? '' : 's'}`;
  document.querySelector('#answerForm').addEventListener('submit', event => { event.preventDefault(); checkAnswer(new FormData(event.currentTarget).get('answer')); });
}

function selectLesson(id) { activeLessonId = id; activeQuestionIndex = 0; quizAttempts = 0; render(); }
function checkAnswer(value) { const lesson = lessons.find(item => item.id === activeLessonId); const question = lesson.questions[activeQuestionIndex]; const feedback = document.querySelector('#answerFeedback'); quizAttempts += 1; if (value.trim().toLowerCase() === question.answer.toLowerCase()) { feedback.innerHTML = `<div class="answer-success">Correct. Nice work.</div><button class="text-button" type="button" data-quiz-action="save">Save this answer as a note</button><button class="text-button" type="button" data-quiz-action="next">Next question</button>`; } else { feedback.innerHTML = `<div class="answer-fail">Not quite yet. Do you want to keep trying or see the answer?</div><button class="secondary-button" type="button" data-quiz-action="retry">Keep trying</button><button class="text-button" type="button" data-quiz-action="reveal">Show answer</button>`; document.querySelector('#answerInput').disabled = true; } document.querySelector('#quizStatus').textContent = `${lesson.title} / ${quizAttempts} attempt${quizAttempts === 1 ? '' : 's'}`; }

function escapeHtml(value) { return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character])); }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
function showOfferingSample(type) {
  const samples = {
    plan: { title: 'Plan your learning', body: '<p>Break a big goal into one useful next step. This sample stays on this page and will not be saved.</p><form id="sampleTaskForm" class="sample-form"><label for="sampleTaskInput">Sample task</label><input id="sampleTaskInput" value="Review JavaScript array methods" required /><button class="primary-button" type="submit">Preview task</button></form>' },
    study: { title: 'Build a test study set', body: '<p>A study set keeps the questions and answers for one exam together. Here is a small preview set.</p><div class="sample-list"><div><strong>Question</strong><span>What does CSS control?</span></div><div><strong>Answer</strong><span>How a page looks and is laid out.</span></div></div><button class="primary-button sample-action" type="button" data-sample-action="account">Create an account to save sets</button>' },
    practice: { title: 'Practice with feedback', body: '<p>Try one quick question. The sample answer is <strong>4</strong>.</p><form id="sampleQuizForm" class="sample-form"><label for="sampleQuizInput">What is 2 + 2?</label><input id="sampleQuizInput" autocomplete="off" required /><button class="primary-button" type="submit">Check sample</button></form><div class="sample-feedback" id="sampleFeedback" aria-live="polite"></div>' },
    notes: { title: 'Keep useful notes', body: '<p>Capture a small idea while it is fresh. This preview disappears when the window closes.</p><form id="sampleNoteForm" class="sample-form"><label for="sampleNoteInput">Sample field note</label><textarea id="sampleNoteInput" rows="3" maxlength="140">Small steps make difficult subjects easier to return to.</textarea><button class="primary-button" type="submit">Preview note</button></form>' }
  };
  const sample = samples[type];
  if (!sample) return;
  document.querySelector('#offeringDialogTitle').textContent = sample.title;
  offeringDialogContent.innerHTML = `<div class="offering-sample-body">${sample.body}</div>`;
  offeringDialog.showModal();
  document.querySelector('#sampleTaskForm')?.addEventListener('submit', event => { event.preventDefault(); showToast('Sample task previewed'); offeringDialog.close(); });
  document.querySelector('#sampleQuizForm')?.addEventListener('submit', event => { event.preventDefault(); const answer = document.querySelector('#sampleQuizInput').value.trim(); document.querySelector('#sampleFeedback').textContent = answer === '4' ? 'Correct. Nice start.' : 'Not quite. Try 4.'; });
  document.querySelector('#sampleNoteForm')?.addEventListener('submit', event => { event.preventDefault(); showToast('Sample note previewed'); offeringDialog.close(); });
  document.querySelector('[data-sample-action="account"]')?.addEventListener('click', () => { offeringDialog.close(); showAuth('signup'); });
}
function showAuth(mode = 'signin') { document.querySelectorAll('.auth-mode-button').forEach(button => button.classList.toggle('active', button.dataset.mode === mode)); document.querySelector('#signinForm').hidden = mode !== 'signin'; document.querySelector('#signupForm').hidden = mode !== 'signup'; document.querySelector('#authError').textContent = ''; if (!authDialog.open) authDialog.showModal(); }
function handleAuthSuccess(result) { if (result.error) { document.querySelector('#authError').textContent = result.error; return; } authDialog.close(); applyPreferences(getPreferences()); activeFilter = 'all'; document.querySelector('.filter-tab.active')?.classList.remove('active'); document.querySelector('.filter-tab[data-filter="all"]').classList.add('active'); render(); switchView(requestedView); showToast(`Welcome, ${result.user.firstName}`); }
function requireAuth() { if (api.getCurrentUser()) return true; showAuth('signin'); return false; }
function switchView(view) { requestedView = view; if ((view === 'learning' || view === 'notes' || view === 'help') && !requireAuth()) return; const privateView = view === 'learning' || view === 'notes' || view === 'help'; document.querySelector('#dashboard').hidden = privateView; document.querySelector('.stats-grid').hidden = privateView; learningPage.hidden = view !== 'learning'; notesPage.hidden = view !== 'notes'; helpPage.hidden = view !== 'help'; document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view)); const titles = { dashboard: api.getCurrentUser() ? `${getTimeGreeting()}, ${escapeHtml(api.getCurrentUser().firstName)}` : 'Your learning orbit', learning: 'Learning tracks', notes: 'Field notes', help: 'Work lab' }; document.querySelector('#greeting').innerHTML = `${titles[view]}<span class="accent">.</span>`; }

taskList.addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (!button) return; if (!requireAuth()) return; const id = Number(button.dataset.id); if (button.dataset.action === 'toggle') { const task = api.getState().tasks.find(item => item.id === id); api.patchTask(id, { done: !task.done }); showToast(task.done ? 'Task reopened' : 'Task completed'); } else { api.deleteTask(id); showToast('Task removed'); } render(); });
noteList.addEventListener('click', event => { const button = event.target.closest('[data-action]'); if (!button) return; if (!requireAuth()) return; if (button.dataset.action === 'add-note') { document.querySelector('#noteInput').focus(); } if (button.dataset.action === 'delete-note') { api.deleteNote(Number(button.dataset.id)); showToast('Note deleted'); render(); } });
studyContent.addEventListener('click', event => { const button = event.target.closest('[data-study-action]'); if (!button) return; if (!requireAuth()) return; const action = button.dataset.studyAction; const state = api.getState(); const studySet = (state.studySets || []).find(item => item.id === activeStudySetId) || (state.studySets || [])[0]; if (action === 'new') { renderCreateStudy(); return; } if (action === 'cancel' || action === 'back') { studyMode = 'practice'; render(); return; } if (action === 'delete' && studySet) { if (!window.confirm(`Delete the study set "${studySet.title}" and all its questions?`)) return; api.deleteStudySet(studySet.id); activeStudySetId = null; studyMode = 'practice'; render(); showToast('Study set deleted'); return; } if (action === 'search') { const query = encodeURIComponent(`${button.dataset.question} explanation lesson examples`); window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener'); showToast('Source search opened'); return; } if (action === 'mock' && studySet?.questions.length) { studyMode = 'mock'; studyQuestionIndex = 0; studyScore = 0; studyMisses = []; render(); return; } if (action === 'practice' && studySet?.questions.length) { studyMode = 'practice-question'; studyPracticeIndex = Number(button.dataset.index); render(); return; } if (action === 'practice-next') { if (studyPracticeIndex === studySet.questions.length - 1) studyMode = 'practice'; else studyPracticeIndex += 1; render(); return; } if (action === 'next') { if (studyQuestionIndex === studySet.questions.length - 1) finishMockTest(studySet); else { studyQuestionIndex += 1; render(); } } });
document.querySelectorAll('.filter-tab').forEach(button => button.addEventListener('click', () => { document.querySelector('.filter-tab.active').classList.remove('active'); button.classList.add('active'); activeFilter = button.dataset.filter; render(); }));
document.querySelector('#lessonPicker').addEventListener('click', event => { const button = event.target.closest('[data-lesson]'); if (button) selectLesson(button.dataset.lesson); });
document.querySelector('#topicSearch').addEventListener('submit', event => { event.preventDefault(); const topic = document.querySelector('#topicInput').value.trim(); if (!topic) return; const query = encodeURIComponent(`${topic} lesson tutorial course`); window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener'); showToast('Source search opened'); });
document.querySelector('#quizCard').addEventListener('click', event => { const action = event.target.closest('[data-quiz-action]')?.dataset.quizAction; if (!action) return; const lesson = lessons.find(item => item.id === activeLessonId); const question = lesson.questions[activeQuestionIndex]; const feedback = document.querySelector('#answerFeedback'); if (action === 'retry') { document.querySelector('#answerInput').disabled = false; document.querySelector('#answerInput').value = ''; document.querySelector('#answerInput').focus(); feedback.innerHTML = ''; } if (action === 'reveal') { feedback.innerHTML = `<div class="answer-reveal">The answer is <strong>${escapeHtml(question.answer)}</strong>.</div><button class="text-button" type="button" data-quiz-action="save">Save answer as a note</button><button class="text-button" type="button" data-quiz-action="next">Next question</button>`; } if (action === 'save') { api.postNote(`${lesson.title}: ${question.prompt} Answer: ${question.answer}`); showToast('Answer saved as a note'); } if (action === 'next') { activeQuestionIndex = (activeQuestionIndex + 1) % lesson.questions.length; quizAttempts = 0; render(); } });
document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
document.querySelectorAll('#newTaskButton, #addTaskRow').forEach(button => button.addEventListener('click', () => { if (!requireAuth()) return; taskDialog.showModal(); document.querySelector('#taskTitle').focus(); }));
document.querySelector('#taskDialog .close-button').addEventListener('click', () => taskDialog.close());
document.querySelector('#taskDialog .dialog-actions .secondary-button').addEventListener('click', event => { event.preventDefault(); taskDialog.close(); });
document.querySelector('#taskForm').addEventListener('submit', event => { event.preventDefault(); if (!requireAuth()) return; const form = new FormData(event.currentTarget); api.postTask({ title: form.get('title'), tag: form.get('tag') }); event.currentTarget.reset(); taskDialog.close(); showToast('Learning task added'); render(); });
document.querySelector('#noteForm').addEventListener('submit', event => { event.preventDefault(); if (!requireAuth()) return; const form = new FormData(event.currentTarget); const body = form.get('note').trim(); if (!body) return; api.postNote(body); event.currentTarget.reset(); showToast('Note saved'); render(); });
document.querySelector('#caseScreenshot').addEventListener('change', event => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener('load', () => { const image = new Image(); image.addEventListener('load', () => { const scale = Math.min(1, 1200 / image.width); const canvas = document.createElement('canvas'); canvas.width = image.width * scale; canvas.height = image.height * scale; canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); pendingScreenshot = canvas.toDataURL('image/jpeg', .78); document.querySelector('#screenshotPreview').innerHTML = `<img src="${pendingScreenshot}" alt="Selected screenshot preview" /><button type="button" class="text-button" id="removeScreenshot">Remove</button>`; document.querySelector('#screenshotPreview').hidden = false; document.querySelector('#removeScreenshot').addEventListener('click', () => { pendingScreenshot = ''; event.target.value = ''; document.querySelector('#screenshotPreview').hidden = true; }); }); image.src = reader.result; }); reader.readAsDataURL(file); });
document.querySelector('#caseForm').addEventListener('submit', event => { event.preventDefault(); if (!requireAuth()) return; const form = new FormData(event.currentTarget); const language = form.get('language') === 'Other' ? form.get('customLanguage').trim() || 'Other' : form.get('language'); api.postHelpCase({ question: form.get('question').trim(), code: form.get('code').trim(), language, screenshot: pendingScreenshot }); event.currentTarget.reset(); pendingScreenshot = ''; document.querySelector('#screenshotPreview').hidden = true; showToast('Case added'); render(); });
caseList.addEventListener('submit', event => { if (!event.target.matches('.case-answer-form')) return; event.preventDefault(); const form = new FormData(event.target); const body = form.get('answer').trim(); if (!body) return; api.postHelpAnswer(Number(event.target.dataset.caseId), body, form.get('source')); showToast('Answer posted'); render(); });
caseList.addEventListener('click', event => { const button = event.target.closest('[data-case-action]'); if (!button) return; if (button.dataset.caseAction === 'draft') { const helpCase = (api.getState().helpCases || []).find(item => item.id === Number(button.dataset.caseId)); const answer = helpCase?.code ? `Start by isolating this to a small reproduction. Check the ${helpCase.language} values and event flow around the failing line, then log the inputs before and after the handler. Compare the result with the expected behavior and change one thing at a time.` : 'Describe the expected result, the actual result, and the smallest step that reproduces it. Then test one hypothesis at a time and record what changed.'; const textarea = document.querySelector(`#answer-${button.dataset.caseId}`); textarea.value = answer; textarea.focus(); textarea.closest('form').querySelector('[name="source"]').value = 'AI draft'; showToast('AI draft added for review'); } if (button.dataset.caseAction === 'search') { window.open(`https://www.google.com/search?q=${encodeURIComponent(`${button.dataset.question} explanation solution`)}`, '_blank', 'noopener'); } });
document.querySelector('#settingsButton').addEventListener('click', () => { if (!requireAuth()) return; const user = api.getCurrentUser(); const preferences = getPreferences(); document.querySelector(`input[name="theme"][value="${preferences.theme}"]`).checked = true; document.querySelector('#customColors').checked = Boolean(preferences.customColors); document.querySelector('#colorPaper').value = preferences.paper; document.querySelector('#colorSurface').value = preferences.surface; document.querySelector('#colorInk').value = preferences.ink; document.querySelector('#colorMint').value = preferences.mint; document.querySelector('#noteSize').value = preferences.noteSize; document.querySelector('#profileFirstName').value = user.firstName; document.querySelector('#profileLastName').value = user.lastName; document.querySelector('#profileEmail').value = ''; document.querySelector('#newPassword').value = ''; document.querySelector('#settingsError').textContent = ''; settingsDialog.showModal(); });
document.querySelector('#settingsForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); const user = api.getCurrentUser(); const newPassword = form.get('newPassword').trim(); const emailConfirmation = form.get('profileEmail').trim().toLowerCase(); if (newPassword && emailConfirmation !== user.email) { document.querySelector('#settingsError').textContent = 'Enter your account email to change the password.'; return; } const preferences = { theme: form.get('theme'), customColors: form.get('customColors') === 'on', paper: form.get('colorPaper'), surface: form.get('colorSurface'), ink: form.get('colorInk'), mint: form.get('colorMint'), noteSize: form.get('noteSize') }; const result = api.updateProfile({ firstName: form.get('firstName').trim(), lastName: form.get('lastName').trim(), preferences, ...(newPassword ? { password: newPassword } : {}) }); if (result.error) { document.querySelector('#settingsError').textContent = result.error; return; } applyPreferences(preferences); settingsDialog.close(); render(); showToast('Settings saved'); });
document.querySelector('#resetButton').addEventListener('click', () => { api.reset(); showToast('Demo data reset'); });
document.querySelector('#authButton').addEventListener('click', () => showAuth('signin'));
document.querySelector('#authCloseButton').addEventListener('click', () => authDialog.close());
document.querySelector('#authContinueButton').addEventListener('click', () => authDialog.close());
document.querySelectorAll('[data-offering]').forEach(button => button.addEventListener('click', () => showOfferingSample(button.dataset.offering)));
document.querySelector('#offeringCloseButton').addEventListener('click', () => offeringDialog.close());
document.querySelector('#signOutButton').addEventListener('click', () => { api.signOut(); applyPreferences(getPreferences()); switchView('dashboard'); render(); showToast('Signed out'); });
document.querySelectorAll('.auth-mode-button').forEach(button => button.addEventListener('click', () => showAuth(button.dataset.mode)));
document.querySelector('#signinForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); handleAuthSuccess(api.signIn(form.get('email'), form.get('password'))); });
document.querySelector('#signupForm').addEventListener('submit', event => { event.preventDefault(); const form = new FormData(event.currentTarget); handleAuthSuccess(api.signUp({ firstName: form.get('firstName').trim(), lastName: form.get('lastName').trim(), email: form.get('email').trim(), password: form.get('password') })); });
applyPreferences(getPreferences());
render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
