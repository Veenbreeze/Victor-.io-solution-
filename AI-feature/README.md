
# AI Coding Assistant

An AI-powered coding assistant built with Django, Ollama, and a modern web interface. The assistant can answer programming questions, explain concepts, generate code, and stream AI responses in real-time.

## Features

* AI-powered programming assistant
* Real-time streaming responses
* Markdown rendering
* Syntax-highlighted code blocks
* Copy code button
* Responsive UI
* Ollama local LLM integration

---

## Project Structure

```text
project-root/
│
├── AI/
│   ├── manage.py
│   ├── requirements.txt
│   ├── server/
│   └── bfrontnd/
│
├── frontend/
│   ├── index.html
│   
│
└── README.md
```

---

## Prerequisites

Install:

* Python 3.10+
* Pip
* Ollama

Verify installations:

```bash
python3 --version
pip --version
ollama --version
```

---

## Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/ai-coding-assistant.git

cd ai-coding-assistant
```

---

## Step 2: Install Backend Dependencies

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python3 -m venv venv
```

Activate:

Linux/macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```


## Step 4: Run Django Backend

Inside backend directory:

Start server:

```bash
python manage.py runserver
```

Backend should be available at:

```text
http://127.0.0.1:8000
```

Test endpoint:

```text
http://127.0.0.1:8000/api/generate
```

---

## Step 5: Run Frontend

Open a new terminal.

Navigate to frontend:

```bash
cd AI-feature/
```

Start local web server:

```bash
python3 -m http.server 5500
```

Open browser:

```text
http://localhost:5500
```

OR can do this:

```text
file:///path/to/index.html
```

because browser security restrictions may block features.

---

## API Endpoint

### POST /chats/

Request:

```json
{
  "message": "How do I create a html login screen?"
}
```

Response:

Streaming text response from AI model.

---



## Tech Stack

Frontend:

* HTML
* CSS
* JavaScript
* Marked.js
* Highlight.js

Backend:

* Django
* Python

AI:

* Ollama
* Qwen2.5-Coder / CodeLlama

---

## Author

CodewithAfidhu
https://www.youtube.com/@CodewithAfidhu

```
```
