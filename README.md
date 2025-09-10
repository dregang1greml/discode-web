DisCode is a web-based code editor built with **Next.js** and **Monaco Editor**.  
It is designed to let users write and run Discord bot scripts right from their browser without installing dependencies.

> **Note:** The backend execution service is **not implemented yet**.  
> Currently, only the front-end interface is functional.

---

## Features:

- **Multiple File Tabs** – Create, switch, and delete multiple files like in VS Code.
- **Monaco Editor** – Full-featured code editor with syntax highlighting.
- **Local Persistence** – Files are automatically saved to `localStorage` and restored on refresh.
- **Download Files** – Save the current tab’s file to your local machine as a `.py`.

---

## Tech Stack

- **Docker**
- **FastAPI**
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **@monaco-editor/react** – Monaco Editor wrapper for React
- **Tailwind CSS** – Styling for the UI
