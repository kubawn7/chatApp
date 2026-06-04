const socket = io("ws://localhost:3000");
const input = document.querySelector(".msg");
const form = document.querySelector("form");
const messages = document.querySelector(".messages");
const fileInput = document.querySelector(".file");
const nick = prompt("Podaj nick");


function addMessageToChat(sender, content, isMe, isImage = false) {

    const container = document.createElement("div");
    container.classList.add("msg-container");
    container.classList.add(isMe ? "right" : "left");


    const nickElement = document.createElement("div");
    nickElement.classList.add("nickname");
    nickElement.innerText = isMe ? "Ja" : sender;


    const bubbleElement = document.createElement("div");
    bubbleElement.classList.add("msg-bubble");


    if (isImage) {
        const img = document.createElement("img");
        img.src = content;
        img.style.maxWidth = "100%"; 
        img.style.borderRadius = "8px";
        img.style.display = "block";
        bubbleElement.appendChild(img);
    } else {
        bubbleElement.innerText = content;
    }


    container.appendChild(nickElement);
    container.appendChild(bubbleElement);
    messages.appendChild(container);


    messages.scrollTop = messages.scrollHeight;
}


//dodawanie placeholdera dla drugiego użytkownika podczas pisania (animacje skaczących kropek)
input.addEventListener("input", () => {
    socket.emit("typing", { nick, "isTyping": input.value.trim() !== "" });
});


socket.on("typing", (obj) => {

    const indicatorId = `typing-${obj.nick}`;
    let typingDiv = document.getElementById(indicatorId);

    if (obj.isTyping) {

        if (!typingDiv) {
            typingDiv = document.createElement("div");
            typingDiv.id = indicatorId;
            typingDiv.classList.add("msg-container", "left");

            typingDiv.innerHTML = `
                <div class="nickname">${obj.nick}</div>
                <div class="msg-bubble typing-bubble">
                    <div class="typing-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                </div>
            `;
            messages.appendChild(typingDiv);
            

            messages.scrollTop = messages.scrollHeight; 
        }
    } else {

        if (typingDiv) {
            typingDiv.remove();
        }
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const file = fileInput.files[0];
    const textContent = input.value.trim();


    if (isImage(file)) {
        const reader = new FileReader();
        reader.onload = function() {

            socket.emit("messageIMG", { nick, "img": reader.result });

            addMessageToChat(nick, reader.result, true, true);
            

            if (textContent !== "") {
                socket.emit("message", { nick, "msg": textContent });
                addMessageToChat(nick, textContent, true, false);
            }
        };
        
        reader.readAsDataURL(file);
        fileInput.value = "";
    } 

    else if (textContent !== "") {
        socket.emit("message", { nick, "msg": textContent });
        addMessageToChat(nick, textContent, true, false);
    }

    input.value = "";
    socket.emit("typing", { nick, "isTyping": false });
});


socket.on("message", (obj) => {
    addMessageToChat(obj.nick, obj.msg, false, false);
});


socket.on("messageIMG", (obj) => {
    addMessageToChat(obj.nick, obj.img, false, true);
});

socket.on("connected", () => {

    alert("Nowy użytkownik się połączył");
});


function isImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return file && acceptedImageTypes.includes(file.type);
}


socket.on("banned", (data) => {
    alert(data.reason);

    input.disabled = true;
    input.placeholder = "Zostałeś rozłączony za spam...";
    
    const submitBtn = document.querySelector(".sbm");
    submitBtn.disabled = true;
    
    const fileLabel = document.querySelector(".file-label");
    fileLabel.style.pointerEvents = "none";
    fileLabel.style.opacity = "0.5";
    
    document.querySelector(".sbm").style.opacity = "0.5";
    addMessageToChat("System", "Utracono połączenie z serwerem (Blokada Anty-Spam). Odśwież stronę.", false, false);
});

socket.on("disconnect", () => {
    console.log("Rozłączono z serwerem.");
});