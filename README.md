# Orbit

Orbit is a small internship learning tracker built as the CAC onboarding project. It turns a week of unfamiliar tools into a visible loop: choose a task, capture what you learn, and close the loop by marking it complete.

## Run it

No install is required. Open `index.html` in a browser, or use VS Code Live Server if it is installed. The app stores demo data in the browser's `localStorage` so tasks and notes survive refreshes.

## What it demonstrates

- Responsive frontend built with semantic HTML, CSS, and JavaScript.
- A small REST-shaped data layer in `app.js` with `getTasks`, `postTask`, `patchTask`, and `deleteTask` operations.
- CRUD-like interactions: add tasks and notes, complete or reopen tasks, delete tasks, filter the task collection, and reset data.
- A deliberate visual system with responsive layout, focus states, motion, and an accessible dialog.

## Production path

The `api` object is intentionally isolated. The next step would be replacing its `localStorage` methods with `fetch('/api/v1/tasks')` calls to a Fastify or Django REST backend, then moving the seed data into a database. The UI contract can remain unchanged because it already works with resource-shaped JSON.

## Version control

This project is designed to live in a Git repository. Suggested first commit:

```bash
git init
git add .
git commit -m "Build Orbit onboarding learning tracker"
```
