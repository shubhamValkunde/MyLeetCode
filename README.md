# My LeetCode Editor

My LeetCode Editor (also known as "LeetCode Clone") is a web-based platform designed to mimic and enhance the LeetCode experience. It allows users to browse, create, and manage coding problems, test solutions in an editor, and track their progress—all within a sleek, user-friendly interface. Built with React and Firebase, this tool is perfect for developers preparing for technical interviews or practicing algorithms and data structures.

## Features
- **Dashboard**: A central hub with quick access to problem creation, problem lists, and user stats (stats and activity tracking planned for future updates).
- **Problem List**: Browse, search, and filter problems by title or topic (e.g., Array, Dynamic Programming), with difficulty levels (Easy, Medium, Hard, Very Hard).
- **Problem Creation**: Add custom challenges with titles, topics, descriptions, constraints, examples, and sample code in C, C++, Java, and Python.
- **Authentication**: Secure user login/logout powered by Firebase Authentication.
- **Editor Integration**: Test solutions in a dedicated editor (accessible via `/editor/[id]` routes).
- **Firestore Backend**: Problems are stored and managed in Firebase Firestore with automatic ID assignment.
- **Responsive UI**: Built with Bootstrap 5 for a clean, mobile-friendly experience.
- **Live Deployment**: Hosted on Firebase at [https://my-leetcode-editor.web.app/dashboard](https://my-leetcode-editor.web.app/dashboard).

## Live Demo
Explore the app here: [https://my-leetcode-editor.web.app/dashboard](https://my-leetcode-editor.web.app/dashboard)

## Installation
To set up My LeetCode Editor locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/[your-username]/my-leetcode-editor.git
