# L'Oréal Beauty Advisor Chatbot

A branded beauty chatbot that helps users explore L'Oréal products, routines,
and beauty recommendations. The interface uses L'Oréal-inspired colors,
typography, and conversational message bubbles.

## Features

- L'Oréal logo and brand colors
- Responsive chat interface for desktop and mobile
- Separate message bubbles for the user and assistant
- Visible, scrollable conversation history
- Multi-turn context so the assistant can remember names and earlier questions
- Editable system prompt for customizing the assistant's behavior
- Cloudflare Worker connection with no API key in the frontend

## How it works

```text
User's browser → Cloudflare Worker → OpenAI API
```

The browser sends a `messages` array to the Cloudflare Worker. The Worker makes
the API request and returns the assistant's response. The full conversation is
kept in the browser while the page is open, allowing natural follow-up
questions.

## Project files

- `index.html` contains the page structure.
- `style.css` contains the L'Oréal branding and chat bubble styles.
- `script.js` stores the conversation and connects to the Cloudflare Worker.
- `img/loreal-logo.png` is the logo used on the page.
- `RESOURCE_cloudflare-worker.js` is example code for the Cloudflare Worker.

## Run the project

1. Open this repository in GitHub Codespaces or your code editor.
2. Open `index.html` with a live preview or a local web server.
3. Type a message into the chat box and select the send button.

## Connect your Cloudflare Worker

Open `script.js` and update `CLOUDFLARE_WORKER_URL` near the top of the file:

```js
const CLOUDFLARE_WORKER_URL =
  "https://your-worker-name.your-subdomain.workers.dev/";
```

The frontend sends requests in this format:

```js
const requestBody = {
  messages: [
    { role: "system", content: "Assistant instructions" },
    { role: "user", content: "Can you recommend a skincare routine?" },
  ],
};
```

It reads the assistant's reply from:

```js
data.choices[0].message.content;
```

## Customize the system prompt

Edit `SYSTEM_PROMPT` near the top of `script.js` to change the assistant's
personality, expertise, or response style:

```js
const SYSTEM_PROMPT = `You are a helpful L'Oréal beauty advisor.
Give friendly, clear, and concise answers.`;
```

## Security

Never place an OpenAI API key in `script.js`, HTML, or any other frontend file.
Frontend files are public and can be scanned by bots shortly after they are
published.

The OpenAI API key must be stored as a secret in the Cloudflare Worker. Students
only need the public Worker URL in `script.js`; they do not need to handle the
API key directly.

## Conversation history

Each user and assistant message is added to the `messages` array in `script.js`.
That complete array is sent with every request so the assistant can understand
earlier parts of the conversation. The visible chat keeps the same history and
automatically scrolls the newest question to the top of the chat window.
