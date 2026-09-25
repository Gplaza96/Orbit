# Orbit: Project Presentation Guide

This document explains how the Orbit app works and how its learning and work-support features fit together. Use it as a presentation guide and a code-reading guide.

## 1. What Orbit is

Orbit is a browser-based learning tracker and private work problem-solving space. A user can:

- Create and complete learning tasks.
- Save field notes.
- Practice built-in lessons with questions and answers.
- Create a personal study set for any test.
- Add custom questions and answers to that study set.
- Practice one question at a time.
- Take a mock test and receive a score.
- Find learning sources when an answer is not known.
- Delete an entire study set when it is no longer needed.
- Change profile and appearance settings.
- Open a separate Work lab for active work issues.
- Add a work question, code snippet, language, and screenshot.
- Keep human answers and AI drafts together on the same issue.
- Search for external explanations when more context is needed.

The application is intentionally small: HTML creates the structure, CSS creates the visual system, and JavaScript controls data and behavior.

## 2. Project files

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure, navigation, forms, dialogs, study-room containers, and Work lab. |
| `styles.css` | Layout, colors, typography, responsive behavior, and states. |
| `app.js` | Data model, local storage, rendering, event handlers, quizzes, study tests, and Work lab cases. |
| `manifest.webmanifest` | Progressive web app name, colors, start URL, and icons. |
| `sw.js` | Service-worker cache for offline-style asset loading. |
| `icon.svg` | Scalable browser icon and app artwork. |
| `icon.ico` | Windows-compatible icon for shortcuts and fallback browser support. |
| `Orbit.url` | Windows Internet Shortcut pointing to the local app. |
| `README.md` | Short project overview and setup notes. |
| `presentation.md` | This detailed learning and presentation guide. |

## 3. How to run the project

For the basic interface, open `index.html` in a browser.

For the manifest and service worker, use a local server such as VS Code Live Server. Service workers normally require `http://localhost` or HTTPS; they do not behave reliably from a `file://` URL.

Example with VS Code Live Server:

1. Open the project folder in VS Code.
2. Install or use the Live Server extension.
3. Open `index.html`.
4. Choose `Go Live`.
5. Visit the local address shown by VS Code.

## 4. The data model

The starting data is stored in `seedData` in `app.js`:

```js
const seedData = {
	tasks: [
		{ id: 1, title: 'Map the request from button to database', done: true }
	],
	notes: [
		{ id: 1, body: 'A useful learning note.' }
	],
	studySets: []
};
```

The real app has more properties, but the important idea is that one user state contains four collections: `tasks`, `notes`, `studySets`, and `helpCases`.

A study set has this shape:

```js
{
	id: 1720000000000,
	title: 'Biology midterm',
	questions: [
		{
			id: 1720000000001,
			prompt: 'What is photosynthesis?',
			answer: 'The process plants use to convert light into chemical energy.'
		}
	],
	lastResult: { score: 1, total: 1, misses: [] }
}
```

`lastResult` is added after a mock test. `misses` stores prompts that need more practice.

A Work lab case has this shape:

```js
{
	id: 1720000000100,
	question: 'Why does this click handler fire twice?',
	code: 'button.addEventListener(...)',
	language: 'JavaScript',
	screenshot: 'data:image/jpeg;base64,...',
	age: 'Just now',
	answers: [
		{ body: 'Check whether the listener is registered twice.', source: 'Human answer' },
		{ body: 'Start with a small reproduction and log the event flow.', source: 'AI draft' }
	]
}
```

The screenshot is resized in the browser before it is saved. This keeps the local demo more likely to stay within browser storage limits.

## 5. The API object and localStorage

The `api` object acts like a small front-end data layer. It keeps storage logic separate from the user interface.

```js
getCurrentUser() {
	const email = localStorage.getItem('orbit-current-user');
	return email ? this.getUsers()[email] : null;
}

getState() {
	return this.getCurrentUser()?.state || structuredClone(seedData);
}

save(state) {
	const email = localStorage.getItem('orbit-current-user');
	const users = this.getUsers();
	if (!email || !users[email]) return state;
	users[email].state = state;
	this.saveUsers(users);
	return state;
}
```

Important concepts:

- `localStorage` stores strings, so objects use `JSON.stringify` and `JSON.parse`.
- `structuredClone(seedData)` prevents accidental changes to the original seed object.
- The current user's email acts as the lookup key.
- Private changes are saved only when a user is signed in.

## 6. Creating a study set

```js
postStudySet(title) {
	const state = this.getState();
	state.studySets = state.studySets || [];
	const studySet = {
		id: Date.now(),
		title,
		questions: [],
		lastResult: null
	};
	state.studySets.unshift(studySet);
	this.save(state);
	return studySet;
}
```

What happens:

1. The user's state is loaded.
2. Older accounts are supported with `state.studySets || []`.
3. `Date.now()` creates a local ID.
4. `unshift()` puts the newest study set first.
5. The state is saved.
6. The new set is returned so the UI can select it.

The form uses `FormData`:

```js
const form = new FormData(event.currentTarget);
const title = form.get('title').trim();
const studySet = api.postStudySet(title);
activeStudySetId = studySet.id;
render();
```

## 7. Adding questions and answers

```js
postStudyQuestion(setId, prompt, answer) {
	const state = this.getState();
	const studySet = (state.studySets || [])
		.find(item => item.id === setId);
	if (!studySet) return null;

	studySet.questions.push({
		id: Date.now(),
		prompt,
		answer
	});
	this.save(state);
	return studySet;
}
```

The HTML form uses required fields and maximum lengths:

```html
<input name="question" required maxlength="180" />
<input name="answer" required maxlength="180" />
```

## 8. Rendering and UI state

The main `render()` function calls `renderQuiz(state)` and `renderStudy(state)`. The study renderer chooses the correct screen using `studyMode`:

| Mode | Screen |
| --- | --- |
| `practice` | Study-set overview and question list. |
| `practice-question` | One custom question with answer checking. |
| `mock` | One mock-test question at a time. |

```js
let activeStudySetId = null;
let studyMode = 'practice';
let studyQuestionIndex = 0;
let studyPracticeIndex = 0;
```

This is a small state machine. Changing a value and calling `render()` changes the visible screen.

## 9. Practice mode and answer checking

Selecting `Practice` stores the question index:

```js
studyMode = 'practice-question';
studyPracticeIndex = Number(button.dataset.index);
render();
```

The submitted answer is normalized:

```js
const value = new FormData(event.currentTarget)
	.get('answer')
	.trim()
	.toLowerCase();

const correct = value === question.answer.trim().toLowerCase();
```

This makes `Paris`, ` paris `, and `PARIS` compare as the same answer. It is an exact text comparison, so a future version could support synonyms or multiple accepted answers.

## 10. Finding sources when an answer is unknown

When an answer is wrong, the source button searches for the exact question:

```js
if (action === 'search') {
	const query = encodeURIComponent(
		`${button.dataset.question} explanation lesson examples`
	);
	window.open(
		`https://www.google.com/search?q=${query}`,
		'_blank',
		'noopener'
	);
	showToast('Source search opened');
}
```

`encodeURIComponent()` makes the question safe inside a URL. `_blank` opens a new tab, and `noopener` prevents the new page from controlling the original page.

The app does not guarantee that every search result is correct. Prefer official documentation, school material, universities, textbooks, and established educational sites.

## 11. Mock tests and scoring

Starting a mock test resets its temporary score:

```js
studyMode = 'mock';
studyQuestionIndex = 0;
studyScore = 0;
studyMisses = [];
render();
```

After each answer:

```js
if (correct) {
	studyScore += 1;
} else {
	studyMisses.push(question.prompt);
}
```

At the end, the result is saved:

```js
savedSet.lastResult = {
	score: studyScore,
	total: studySet.questions.length,
	misses: studyMisses.slice()
};
api.save(state);
```

`slice()` stores a snapshot of the missed questions for later review.

## 12. Deleting a study set

The delete API removes the selected set by filtering it out:

```js
deleteStudySet(setId) {
	const state = this.getState();
	state.studySets = (state.studySets || [])
		.filter(item => item.id !== setId);
	return this.save(state);
}
```

The UI confirms before deleting:

```js
if (!window.confirm(
	`Delete the study set "${studySet.title}" and all its questions?`
)) return;

api.deleteStudySet(studySet.id);
activeStudySetId = null;
studyMode = 'practice';
render();
```

Deleting a set also deletes its questions and last mock result, so confirmation is important.

## 13. Work lab

Work lab is intentionally separate from Learning tracks. It is for a real task that is currently blocked, not for a test or study set.

The case form collects:

- The work question or issue.
- The smallest useful code snippet.
- The language or framework, including a custom language.
- An optional PNG, JPEG, or WebP screenshot.

The main methods are:

```js
postHelpCase(input) {
	const state = this.getState();
	state.helpCases = state.helpCases || [];
	const helpCase = {
		id: Date.now(),
		question: input.question,
		code: input.code,
		language: input.language,
		screenshot: input.screenshot || '',
		answers: [],
		age: 'Just now'
	};
	state.helpCases.unshift(helpCase);
	this.save(state);
	return helpCase;
}

postHelpAnswer(caseId, body, source) {
	const state = this.getState();
	const helpCase = state.helpCases.find(item => item.id === caseId);
	if (!helpCase) return null;
	helpCase.answers.push({ id: Date.now(), body, source, age: 'Just now' });
	this.save(state);
	return helpCase;
}
```

Answers are labeled `Human answer` or `AI draft`. The current AI button creates a local draft prompt for review; it is not connected to an external AI provider yet. A production version should send the question, code, and user-approved screenshot to a protected AI service and keep the human answer option available.

## 14. Event delegation

Study content is replaced during every render. One stable parent handles buttons created later:

```js
studyContent.addEventListener('click', event => {
	const button = event.target.closest('[data-study-action]');
	if (!button) return;

	const action = button.dataset.studyAction;
	// Handle new, delete, practice, mock, search, and next actions.
});
```

This pattern is called event delegation. The click bubbles from the dynamic button to `studyContent`, where one listener handles it.

## 15. HTML and CSS structure

The study room has a stable mount point in `index.html`:

```html
<section class="study-panel" id="studyPanel">
	<div class="panel-heading">
		<div>
			<p class="section-kicker">Prepare for a test</p>
			<h3>Test study room</h3>
		</div>
		<span id="studyStatus">Build your study set</span>
	</div>
	<div id="studyContent"></div>
</section>
```

The question form uses CSS Grid:

```css
.study-add-form {
	display: grid;
	grid-template-columns: 1fr 1fr auto;
	gap: 9px;
	align-items: end;
}
```

The project uses CSS variables for themes:

```css
:root {
	--ink: #17221e;
	--paper: #f4f1ea;
	--surface: #fffdf8;
	--mint-dark: #197050;
}
```

## 16. Icon and Windows shortcut fix

Browsers can use SVG icons, but Windows Internet Shortcuts are more reliable with `.ico`. The page now includes both:

```html
<link rel="icon" href="icon.ico" sizes="32x32" type="image/x-icon" />
<link rel="icon" href="icon.svg" type="image/svg+xml" />
```

The manifest includes `icon.ico`, and `Orbit.url` contains:

```ini
IconFile=C:\Users\gplaza\Desktop\app\icon.ico
```

The service-worker cache was changed from `orbit-v1` to `orbit-v2` and now includes both icon files. 
Changing the cache name makes the browser create a new cache with the new assets.

## 17. Service worker

```js
const CACHE_NAME = 'orbit-v2';
const APP_FILES = [
	'./', './index.html', './styles.css', './app.js',
	'./manifest.webmanifest', './icon.ico', './icon.svg'
];
```

Installation caches the files:

```js
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
	);
	self.skipWaiting();
});
```

Fetches use cache first and network second:

```js
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(cached => cached || fetch(event.request))
	);
});
```

## 18. Security and production limitations

This is a learning project, not a production authentication system.

- Passwords are stored in `localStorage` as plain text. A real app must never do this.
- Production authentication needs a server, hashed passwords, secure cookies, and authorization checks.
- Search results are external content and are not automatically verified.
- `Date.now()` is acceptable for this local demo, but a database should generate IDs.
- The mock grader uses exact normalized text comparison.
- `localStorage` is limited to one browser profile and one device.
- Screenshots are stored in the user's browser and can use significant local storage.
- The current AI draft is a local helper, not a live AI answer service.
- A production AI integration must remove secrets from the browser and protect uploaded code and screenshots.

## 19. Future REST API

The current front-end methods could become endpoints:

```text
GET    /api/v1/tasks
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id

GET    /api/v1/study-sets
POST   /api/v1/study-sets
POST   /api/v1/study-sets/:id/questions
DELETE /api/v1/study-sets/:id
POST   /api/v1/study-sets/:id/mock-results

GET    /api/v1/help-cases
POST   /api/v1/help-cases
POST   /api/v1/help-cases/:id/answers
POST   /api/v1/help-cases/:id/ai-draft
```

The UI could keep the same forms and render functions while replacing local storage calls with `fetch()` requests.

## 20. Presentation demo script

1. Open Orbit and explain the dashboard progress indicator.
2. Sign in or create an account.
3. Open `Learning tracks`.
4. Create a study set called `JavaScript exam`.
5. Add two or three question and answer pairs.
6. Practice one question and intentionally answer incorrectly.
7. Click `Find sources for this question`.
8. Return to Orbit and start a mock test.
9. Answer some questions correctly and some incorrectly.
10. Show the saved score and missed topics.
11. Delete the study set and confirm the empty state returns.
12. Open `Work lab` and explain that it is separate from study preparation.
13. Add a work issue with a language, code snippet, and screenshot.
14. Add a human answer, then generate an AI draft and review it before posting.
15. Refresh and explain that signed-in data survives through `localStorage`.

## 21. Exercises

### Beginner

1. Change the empty study-state text.
2. Add a third built-in lesson to the `lessons` array.
3. Change the mock-test success message.
4. Explain why `encodeURIComponent()` is used before opening Google.

### Intermediate

1. Add a `difficulty` field to custom questions.
2. Add easy, medium, and hard filters.
3. Add a button to delete one question without deleting its set.
4. Store practice-attempt counts for each question.

### Advanced

1. Accept multiple correct answers as an array.
2. Add a review queue containing only missed questions.
3. Replace Google search with a curated source form.
4. Move storage to a REST API.
5. Add server-side authentication.
6. Add tests for study-set creation, question creation, deletion, and mock scoring.
7. Connect Work lab AI drafts to a protected server endpoint.
8. Add status, priority, and assignee fields to work cases.
9. Store screenshots in object storage instead of `localStorage`.

## 22. Main lessons

- Keep data operations in one API-like object.
- Keep rendering functions responsible for turning state into HTML.
- Use explicit UI state for multi-step workflows.
- Use event delegation for dynamic content.
- Escape user text before placing it into HTML.
- Persist data after successful state changes.
- Confirm destructive operations.
- Treat external search results as references that still need judgment.
- Keep work debugging separate from study workflows.
- Treat AI output as a draft that needs human review.
- Design a local demo so it can later become a real backend.
