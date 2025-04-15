# ToastMaster 🎯

**ToastMaster** is a vibrant, feature-packed todo list application built to supercharge productivity with style and interactivity. Designed for modern users, it combines intuitive task management with delightful animations, sound effects, and a celebratory confetti burst to make every completed task feel like a win. Whether you’re organizing work projects, personal errands, or side hustles, TodoMaster has you covered with accessibility, mobile support, and a polished UI that shines in both light and dark modes.

<p align="center">
  <img width="1504" alt="image" src="https://github.com/user-attachments/assets/cb21232f-b9e3-4507-b7e7-bf924a118251" />

</p>

<p align="center">
  <a href="https://laffingdragons.github.io/Todolist-with-hooks-React/" target="_blank">Live Demo</a> • 
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


## 📸 Screenshots

### Light Mode with Category Filter
<img width="1504" alt="image" src="https://github.com/user-attachments/assets/2c25a228-dfee-40e8-8982-043635912582" />



### Dark Mode with Confetti
<img width="1492" alt="image" src="https://github.com/user-attachments/assets/740967db-e63c-4bbf-bcb2-bbd7ee366e2f" />


*Add these images to your repo after capturing screenshots.*

## ⚙️ Setup Instructions

Get TodoMaster running locally in minutes:

# TodoMaster Setup and Usage Guide

## Install Dependencies:

1. **Clone the Repository**:
   ``` npm install

Required packages: `react`, `react-dnd`, `react-dnd-html5-backend`, `react-dnd-touch-backend`, `animejs`, `react-toastify`, `react-confetti`, `moment`, `uuid`.



## Add Sound File (Optional):
Place `click.mp3` in `public/sounds/` for deletion sound.

Download from [freesound.org](https://freesound.org) or use your own short audio clip.

## Run the App:
   git clone https://github.com/your-username/todomaster.git
   cd todomaster
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production (Optional):

Deploy the `build/` folder to a hosting service like Netlify or Vercel.

## Why TodoMaster Wins Hackathons
TodoMaster isn’t just another todo app—it’s a delightful experience that blends functionality with flair:
- **User-Centric Design**: Intuitive UI with tooltips, animations, and sound effects to keep users engaged.
- **Technical Excellence**: Clean React code with hooks, optimized state updates, and robust error handling.
- **Accessibility Focus**: ARIA labels and keyboard support ensure inclusivity.
- **Polish**: Confetti, dark mode, and a custom favicon make it memorable.
- **Scalability**: Modular components (e.g., TodoItem, TodoLists) ready for future features like API integration or collaboration.

Judges will love the attention to detail, from the animated SVG background to the celebratory confetti that rewards productivity.

## Potential Improvements
With more time, we could add:
- **API Integration**: Sync tasks with a backend (e.g., Firebase).
- **Task Priorities**: Add high/medium/low priority tags.
- **Export/Import**: Save tasks as JSON or CSV.
- **Notifications**: Browser alerts for overdue tasks.
- **Collaboration**: Share task lists with others in real-time.

## Contributing
Want to make TodoMaster even better? Contributions are welcome!
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/awesome-idea`).
3. Commit changes (`git commit -m "Add awesome idea"`).
4. Push to your fork (`git push origin feature/awesome-idea`).
5. Open a Pull Request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and add tests for new features.

## License
This project is licensed under the MIT License. See LICENSE for details.

## Acknowledgments
- Inspired by productivity apps like Todoist and Notion.
- Sound effect from [freesound.org](https://freesound.org).
- Icons and design ideas from [flaticon.com](https://flaticon.com).
- Built with ❤️ for the [Akshay Patil] Outlier.ai hackathon.

Let’s make productivity fun! Try TodoMaster, crush your tasks, and enjoy the confetti. Got feedback? Open an issue or tweet us at @YourTwitterHandle.
