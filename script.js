// Replace this placeholder with your Cloudflare Worker URL later.
// Example format: https://your-worker-name.your-subdomain.workers.dev/
const CLOUDFLARE_WORKER_URL = "https://round-surf-cde0.sarim-muhammad.workers.dev";

// Edit this text to describe how the beauty advisor should behave.
const SYSTEM_PROMPT = `You are a helpful L'Oréal beauty advisor. Give friendly, clear, and concise answers. You are only permitted to provide information about L'Oréal products and beauty routines. Even if the user requests information about other brands or products, you must only provide information about L'Oréal. You are not permitted to speak on anything besides beauty and routine related topics. `;

// Get the HTML elements that the chatbot needs.
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const sendButton = document.getElementById("sendBtn");

// Start the conversation with the system prompt instructions.
// The Worker receives this before any messages from the user.
const messages = [{ role: "system", content: SYSTEM_PROMPT }];

// Add one message to the chat window.
function showMessage(text, sender) {
  const messageElement = document.createElement("p");
  messageElement.className = `msg ${sender}`;
  messageElement.textContent = text;
  chatWindow.appendChild(messageElement);
  return messageElement;
}

// Scroll the chat so the latest question sits at the top of the window.
function moveQuestionToTop(questionElement) {
  chatWindow.scrollTop = questionElement.offsetTop - 20;
}

// Show a welcome message when the page loads.
showMessage("👋 Hello! How can I help you today?", "ai");

// Send the user's message to the Cloudflare Worker.
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  // Do not send an empty message.
  if (!userMessage) {
    return;
  }

  // Keep earlier messages visible and move the newest question to the top.
  const questionElement = showMessage(userMessage, "user");
  moveQuestionToTop(questionElement);
  messages.push({ role: "user", content: userMessage });
  userInput.value = "";
  sendButton.disabled = true;

  try {
    // Send the conversation to the class-hosted Cloudflare Worker.
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });

    if (!response.ok) {
      throw new Error(`The Worker returned status ${response.status}.`);
    }

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    showMessage(assistantReply, "ai");
    moveQuestionToTop(questionElement);
    messages.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    console.error("Chat request failed:", error);
    showMessage(
      "Sorry, I could not reach the beauty advisor. Please check the Worker URL and try again.",
      "ai",
    );
    moveQuestionToTop(questionElement);
  } finally {
    sendButton.disabled = false;
    userInput.focus();
  }
});
