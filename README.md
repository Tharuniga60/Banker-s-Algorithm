# 🏦 Banker's Algorithm Simulator

> A modern, interactive deadlock avoidance simulator built with HTML, CSS & Vanilla JavaScript.

---

## 📋 Overview

This web application implements the **Banker's Algorithm** — a classical deadlock avoidance algorithm used in Operating Systems. It allows users to input system resource matrices and simulate the safety algorithm step by step.

---

## ✨ Features

### Core Algorithm
- ✅ **Need Matrix** computation: `Need = Maximum − Allocation`
- ✅ **Safety Algorithm** — detects safe/unsafe system state
- ✅ **Safe Sequence** generation with full trace
- ✅ **Step-by-Step** simulation log of every decision

### UI/UX
- 🎨 **Modern Dashboard** — glassmorphism, gradient backgrounds
- 💎 **Animated UI** — particles, orbit rings, smooth transitions
- 🌗 **Dark / Light Mode** toggle
- 📊 **Execution Timeline Bar** — animated process execution order
- 🔔 **Toast Notifications** — live feedback on actions
- ♻️ **Reset button** — clears all state
- 🎲 **Random Example Generator** — 3 built-in classic examples
- 📱 **Responsive** — works on desktop, tablet, and mobile

---

## 📁 Folder Structure

```
bankers-algorithm-simulator/
│
├── index.html     ← App structure & semantic markup
├── style.css      ← Full styling: glassmorphism, animations, themes
├── script.js      ← Algorithm logic + UI interactivity
└── README.md      ← This file
```

---

## 🚀 Getting Started

1. **Clone or download** this folder.
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Edge).
3. No server or build step required — 100% client-side.

---

## 🧠 How It Works

### Step 1 – Configure System
- Enter **number of Processes (P)** and **Resource Types (R)**
- Click **"Generate Tables"** to create the input grids
- Or click **"Random Example"** for a pre-loaded scenario

### Step 2 – Fill Matrices
- **Available Resources Vector** — resources currently free
- **Allocation Matrix** — resources currently held by each process
- **Maximum Matrix** — max resources each process may ever need

### Step 3 – Run Algorithm
Click **"Run Algorithm"** to:
1. Compute the **Need Matrix**
2. Execute the **Banker's Safety Algorithm**
3. Display **Safe/Unsafe** state
4. Show the **Safe Sequence** (if safe)
5. Animate the **Execution Timeline**
6. Log every **Step** in the simulation

---

## 📐 Algorithm Reference

```
Initialization:
  Work = Available
  Finish[i] = false for all i

Find i such that:
  Finish[i] == false AND Need[i] ≤ Work
  → Work = Work + Allocation[i]
  → Finish[i] = true
  → Repeat

If all Finish[i] == true → SAFE STATE ✅
Else                     → UNSAFE STATE ❌
```

---

## 🎨 Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic structure, accessibility |
| **CSS3** | Glassmorphism, animations, grid layout |
| **Vanilla JS** | Algorithm logic, DOM manipulation |
| **Google Fonts** | Inter, Poppins, JetBrains Mono |

---

## 🎯 Color Coding

| Color | Meaning |
|---|---|
| 🟢 Green | Safe process / Safe state |
| 🔴 Red | Unsafe state / failed match |
| 🔵 Blue | Allocation information |
| 🟡 Amber | High need values |
| 🟣 Purple | Process labels / accents |

---

## 📌 Example

**Classic Banker's Algorithm Test Case:**

| Process | Allocation (A B C) | Maximum (A B C) | Need (A B C) |
|---|---|---|---|
| P0 | 0 1 0 | 7 5 3 | 7 4 3 |
| P1 | 2 0 0 | 3 2 2 | 1 2 2 |
| P2 | 3 0 2 | 9 0 2 | 6 0 0 |
| P3 | 2 1 1 | 2 2 2 | 0 1 1 |
| P4 | 0 0 2 | 4 3 3 | 4 3 1 |

**Available:** [3, 3, 2]

**Safe Sequence:** `P1 → P3 → P4 → P0 → P2`

---

## 👨‍💻 Author

Built as an Operating Systems academic project.
