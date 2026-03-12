# Manual Test: Managing Controls, Owners, and Tasks

Transitional — retire when all `.feature` scenarios are wired to Playwright.

## Prerequisites

- MongoDB running (`docker compose up -d` from project root)
- Server running on `http://localhost:4000/graphql`
- Client running on `http://localhost:5173`

---

## Owners (`/owners`)

### Create owner

1. Click **Create Owner**
2. Submit with both fields empty → "Name is required" and "Email is required" appear
3. Enter a name, enter `notanemail` for email → "Enter a valid email address" appears
4. Enter a valid name and email → dialog closes, new row appears in the table immediately (optimistic)

### Edit owner

1. Click the actions menu (⋮) on any row → click **Edit**
2. Change the name or email → click **Save** → row updates immediately

### Delete owner with no tasks

1. Click actions menu → **Delete**
2. Confirm dialog shows the owner name in the title
3. Click **Delete** → row removed immediately

### Delete owner with tasks assigned

1. Ensure an owner has at least one task (create one on the Tasks page first)
2. Click actions menu → **Delete**
3. Confirm dialog shows: "Any tasks assigned to them will also be deleted."
4. Click **Delete** → owner row removed; verify on Tasks page that their tasks are also gone

---

## Tasks (`/tasks`)

### Create task

1. Click **Create Task**
2. Submit with all fields empty → validation errors appear for Description, Control, Owner, and Due Date
3. Fill all required fields → dialog closes, new row appears immediately

### Edit task

1. Click actions menu → **Edit** on any row
2. Change description or due date → **Save** → row updates immediately

### Delete task

1. Click actions menu → **Delete**
2. Confirm dialog shows the task description in the title
3. Click **Delete** → row removed immediately

---

## Controls (`/`)

### Create control

1. Click **Create Control**
2. Submit with empty Title and Category → validation errors appear
3. Fill Title and Category (Status defaults to Unknown) → dialog closes, new row appears immediately

### Edit control

1. Click actions menu → **Edit** on any row
2. Verify Status field is present (it is not shown in Create dialog)
3. Change title or status → **Save** → row updates immediately

### Delete control with no tasks

1. Click actions menu → **Delete**
2. Confirm dialog shows the control title in the title
3. Click **Delete** → row removed immediately

### Delete control with tasks assigned

1. Ensure a control has at least one task
2. Click actions menu → **Delete**
3. Confirm dialog shows: "Any tasks assigned to this control will also be deleted."
4. Click **Delete** → control row removed; verify on Tasks page that its tasks are also gone

### Status filter

1. Use the toggle buttons (All / Passing / Failing / Unknown) to filter the table
2. Verify only rows matching the selected status are shown

### Task drawer

1. Click any control row (not the actions menu)
2. Drawer opens on the right showing tasks for that control
3. Click outside or press Escape → drawer closes
