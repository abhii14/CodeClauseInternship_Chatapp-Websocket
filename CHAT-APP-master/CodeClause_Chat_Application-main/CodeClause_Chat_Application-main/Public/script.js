(function() {
  const app = document.querySelector(".app");
  const socket = io();
  let uname;

  

  app.querySelector(".join-screen #join-user").addEventListener("click", function() {
      let username = app.querySelector(".join-screen #username").value;
      if (username.length == 0) {
          return;
      }
      socket.emit("newuser", username);
      uname = username;
      app.querySelector(".join-screen").classList.remove("active");
      app.querySelector(".chat-screen").classList.add("active");
  });

  app.querySelector(".chat-screen #send-message").addEventListener("click", sendMessage);
  app.querySelector(".chat-screen #message-input").addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
          sendMessage();
      }
  });

  function sendMessage() {
      let message = app.querySelector(".chat-screen #message-input").value;
      if (message.length == 0) {
          return;
      }
      renderMessage("my", {
          username: uname,
          text: message,
          timestamp: new Date().toLocaleTimeString()
      });
      socket.emit("chat", {
          username: uname,
          text: message
      });

      app.querySelector(".chat-screen #message-input").value = ""; 
  }

  function renderMessage(type, message) {
    let messagecontainer = app.querySelector(".chat-screen .messages");
    if (type == "my") {
      let el = document.createElement("div");
      el.setAttribute("class", "message my-message");
      el.innerHTML = `
        <div>
          <div class="name">You</div>
          <div class="text">${message.text}</div>
          <div class="timestamp">${message.timestamp}</div> 
        </div>
        <button  class="delete-message">
          <i class="fas fa-trash"></i>
        </button>`;
      messagecontainer.appendChild(el);
  
      const deleteButton = el.querySelector(".delete-message");
      deleteButton.addEventListener("click", function () {
        el.remove(); 
      });
    } else if (type == "other") {
      let el = document.createElement("div");
      el.setAttribute("class", "message other-message");
      el.innerHTML = `
        <div>
          <div class="name">${message.username}</div>
          <div class="text">${message.text}</div>
          <div class="timestamp">${getCurrentTimestamp()}</div> 
        </div>
        <button  class="delete-message">
          <i class="fas fa-trash"></i>
        </button>`;
      messagecontainer.appendChild(el);
  
      const deleteButton = el.querySelector(".delete-message");
      deleteButton.addEventListener("click", function () {
        el.remove(); 
      });

    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messagecontainer.appendChild(el);
    }
    messagecontainer.scrollTop = messagecontainer.scrollHeight - messagecontainer.clientHeight;
  }

    function getCurrentTimestamp() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds=date.getSeconds().toString().padStart(2,"0");
    return `${hours}:${minutes}:${seconds}`;
  }
  
  app.querySelector(".chat-screen #userexit").addEventListener("click", function() {
      socket.emit("exituser", uname);
      window.location.reload();
  });

  app.querySelector(".chat-screen .messages").addEventListener("click", function(event) {
      if (event.target.classList.contains(".delete-message")) {
          const messageElement = event.target.closest(".message");
          if (messageElement) {
              messageElement.remove();
          }
      }
  });

  socket.on("update", function(update) {
      renderMessage("update", update);
  });

  socket.on("chat", function(message) {
      renderMessage("other", message);
  });
})();
