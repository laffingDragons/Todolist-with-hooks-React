# ToastMaster 🎯

**ToastMaster** is a vibrant, feature-packed todo list application built to supercharge productivity with style and interactivity. Designed for modern users, it combines intuitive task management with delightful animations, sound effects, and a celebratory confetti burst to make every completed task feel like a win. Whether you’re organizing work projects, personal errands, or side hustles, TodoMaster has you covered with accessibility, mobile support, and a polished UI that shines in both light and dark modes.

<p align="center">
  <img src="screenshot.png" alt="TodoMaster Screenshot" width="600"/>
</p>

<p align="center">
  <a href="https://your-live-demo-link.com">Live Demo</a> • 
  <a href="https://youtu.be/your-demo-video-id">Demo Video</a>
</p>

## 🚀 Features

TodoMaster stands out with a rich set of features that make task management fun, efficient, and accessible:

- **Task Management**:
  - Add, edit, delete, and reorder tasks and subtasks with smooth drag-and-drop.
  - Assign categories (General, Work, Personal) to organize tasks.
  - Set due dates with visual overdue indicators.
  - Track subtask progress with dynamic progress bars.

- **Interactive UX**:
  - **Sound Effects**: Hear a satisfying click when deleting tasks.
  - **Confetti Celebration**: Burst of confetti when all tasks are completed or cleared.
  - **Animations**: Fade-in/out transitions and animated checkboxes powered by Anime.js.
  - **Toast Notifications**: Real-time feedback for actions using react-toastify.

- **Customization**:
  - **Category Filtering**: View tasks by category or all at once.
  - **Dark/Light Mode**: Toggle themes with a sleek button, persisted via localStorage.
  - **Tooltips**: Hover for guidance on editing, deleting, or adding subtasks.

- **Accessibility**:
  - ARIA labels for screen readers (e.g., checkboxes, buttons).
  - Keyboard support (Enter to add tasks, Escape to cancel).
  - High-contrast UI for readability.

- **Mobile-Friendly**:
  - Responsive design with touch-based drag-and-drop (via react-dnd TouchBackend).
  - Sticky input bar for easy task entry on small screens.

- **Persistence**:
  - Tasks and themes saved to localStorage for seamless sessions.
  - Robust state management to prevent data loss.

- **Branding**:
  - Custom favicon and “TodoMaster” title for a professional touch.
  - Eye-catching SVG background with animated shapes.

## 🛠 Tech Stack

TodoMaster is built with modern tools to ensure performance, scalability, and developer-friendly code:

- **Frontend**: React (functional components, hooks)
- **Drag-and-Drop**: react-dnd (HTML5Backend for desktop, TouchBackend for mobile)
- **Animations**: Anime.js for smooth transitions
- **Notifications**: react-toastify for user feedback
- **Confetti**: react-confetti for celebratory effects
- **Date Handling**: Moment.js for formatting due dates
- **UUID**: uuid for unique task IDs
- **Styling**: CSS with CSS Variables for theming, responsive media queries
- **Persistence**: localStorage for data and theme storage
- **Build Tool**: Create React App

## 🎥 Demo Video

Watch TodoMaster in action! Our [demo video](https://youtu.be/your-demo-video-id) showcases:
- Adding tasks with categories
- Filtering by category
- Dragging tasks and subtasks
- Deleting tasks with sound effects
- Completing tasks to trigger confetti
- Toggling dark/light mode

*Replace the link with your uploaded video after recording.*

## 📸 Screenshots

### Light Mode with Category Filter
![Light Mode](screenshot-light.png)

### Dark Mode with Confetti
![Dark Mode](screenshot-dark.png)

*Add these images to your repo after capturing screenshots.*

## ⚙️ Setup Instructions

Get TodoMaster running locally in minutes:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/todomaster.git
   cd todomaster
