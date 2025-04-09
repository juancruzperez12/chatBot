document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const messagesContainer = document.getElementById("messages");

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  async function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    appendMessage("user", userText);
    userInput.value = "";

    showTypingIndicator();

    const botReply = await getBotResponse(userText);

    hideTypingIndicator();
    appendMessage("bot", botReply);
  }

  function appendMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.id = "typing-indicator";
    typing.classList.add("message", "bot");
    typing.innerText = "Escribiendo...";
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  }

  async function getBotResponse(userText) {
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error al obtener respuesta del bot:", error);
      return "Ocurrió un error al comunicarse con el servidor. Intentá de nuevo más tarde.";
    }
  }
});
