# Responsive Layout — Manual Test Steps

**Prerequisites:** server running on port 4000, MongoDB up, client running on port 5173.

---

## Setup

1. Open `http://localhost:5173` in Chrome
2. Open DevTools (`F12`) → click **Toggle device toolbar** (`Ctrl+Shift+M`)

---

## Mobile (< 600px)

Set a custom size of **400 × 800**.

| What to check | Expected |
|---|---|
| Page padding | Tighter — 16px on all sides |
| Columns in controls table | **Category hidden** — only Title and Status visible |
| Status filter buttons | Wrap onto a second row if they don't fit on one line |
| Click a table row | Task drawer opens and fills the **full viewport width** |

---

## Desktop (≥ 600px)

Set width to **800 × 800**.

| What to check | Expected |
|---|---|
| Page padding | Wider — 24px on all sides |
| Columns in controls table | **Category visible** |
| Click a table row | Task drawer opens at **400px wide**, not full-screen |

---

## Full browser width

Exit device mode (`Ctrl+Shift+M`). Confirm:
- Controls table fills the available width
- No horizontal scrollbar on the page
- Task drawer remains 400px wide
