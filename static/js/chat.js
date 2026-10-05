console.log("Grand Line AI Loaded");

// Character from URL
const character = window.location.pathname.split("/").pop();

// Character Data
const data = {

    luffy: {

        name: "Monkey D. Luffy",

        image: "/static/images/Luffy .png",

        background: "/static/images/luffy-chat.jpg",

        backgroundPosition:"center center",
        color: "#ff3131",

        msg: "👒 Shishishi!! Welcome aboard, Nakama!"


    },

    zoro: {

        name: "Roronoa Zoro",

        image: "/static/images/Roronoa Zoro Epic Wanted Poster _ King of Hell.png",

        background: "/static/images/zoro-chat.jpg",
        backgroundPosition:"center top",

        color: "#00ff55",

        msg: "⚔️ Hmph... Speak. I'll cut through your doubts."

    },

    nami: {

        name: "Nami",

        image: "/static/images/nami.png",

        background: "/static/images/nami-chat.jpg",
        backgroundPosition:"center center",
        color: "#b400ff",

        msg: "🧭 Ready to explore? I'll guide the way."

    },

    sanji: {

        name: "Vinsmoke Sanji",

        image: "/static/images/Sanji .png",

        background: "/static/images/sanji-chat.jpg",
        backgroundPosition:"center 25%",

        color: "#FFD700",

        msg: "👨‍🍳 Welcome. Sit down and let's have a conversation."

    }

};

// Default if URL is wrong
const current = data[character] || data.luffy;

// Header
document.getElementById("characterName").innerText = current.name;
document.getElementById("characterIcon").src = data[character].image;
//document.getElementById("characterImage").src = current.image;
document.querySelector(".chat-header").style.backgroundImage =
`url('/static/images/${character}-header.png')`;

// Welcome Message
document.getElementById("welcomeMessage").innerText = current.msg;
////////////----------------------------------------------------------------
// Background Image
document.body.style.backgroundImage = `url(${current.background})`;

document.body.style.backgroundSize = "cover";
 document.body.style.backgroundPosition = "center";
// document.body.style.backgroundPosition = current.backgroundPosition;
document.body.style.backgroundRepeat = "no-repeat";

// Character Theme Color
document.querySelector(".chat-header").style.borderBottom =
`3px solid ${current.color}`;

document.querySelector(".chat-input button").style.background =
current.color;

document.querySelector(".bot-message").style.border =
`2px solid ${current.color}`;
// =============================
// CHAT FUNCTIONALITY
// =============================

// const input = document.getElementById("userInput");
// const sendBtn = document.getElementById("sendBtn");

// // const messages = document.querySelector(".messages");
// const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");
// =============================
// FILE UPLOAD
// =============================

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

let selectedFile = null;


// Open file picker
uploadBtn.addEventListener("click", function () {

    fileInput.click();

});


// When file is selected
fileInput.addEventListener("change", function () {

    if (fileInput.files.length === 0) {
        return;
    }

    selectedFile = fileInput.files[0];

    console.log("Selected file:", selectedFile.name);
    console.log("File type:", selectedFile.type);
    console.log("File size:", selectedFile.size);


    // =============================
    // CREATE FILE PREVIEW
    // =============================

    const fileMessage = document.createElement("div");

    fileMessage.className = "file-preview";


    // =============================
    // IMAGE PREVIEW
    // =============================

    if (selectedFile.type.startsWith("image/")) {

        const imageURL = URL.createObjectURL(selectedFile);

        fileMessage.innerHTML = `
            <div class="preview-header">
                <span>📎 ${selectedFile.name}</span>
                <button id="removeFileBtn" type="button">✕</button>
            </div>

            <img
                src="${imageURL}"
                class="uploaded-image-preview"
                alt="Uploaded image"
            >
        `;
    }


    // =============================
    // PDF PREVIEW
    // =============================

    else if (selectedFile.type === "application/pdf") {

        const pdfURL = URL.createObjectURL(selectedFile);

        fileMessage.innerHTML = `
            <div class="preview-header">
                <span>📄 ${selectedFile.name}</span>
                <button id="removeFileBtn" type="button">✕</button>
            </div>

            <iframe
                src="${pdfURL}"
                class="uploaded-pdf-preview">
            </iframe>
        `;
    }


    // =============================
    // OTHER FILE
    // =============================

    else {

        fileMessage.innerHTML = `
            <div class="preview-header">
                <span>📎 ${selectedFile.name}</span>
                <button id="removeFileBtn" type="button">✕</button>
            </div>
        `;
    }


    messages.appendChild(fileMessage);

    messages.scrollTop = messages.scrollHeight;


    // =============================
    // REMOVE FILE
    // =============================

    document
        .getElementById("removeFileBtn")
        .addEventListener("click", function () {

            selectedFile = null;

            fileInput.value = "";

            fileMessage.remove();

        });

});
    messages.scrollTop = messages.scrollHeight;


    // Remove selected file
    document.getElementById("removeFileBtn").addEventListener(
        "click",
        function () {

            selectedFile = null;
            fileInput.value = "";
            fileMessage.remove();

        }
    );

// =============================
// SEND / ENTER
// =============================

console.log("🔥🔥 SEND BLOCK LOADED 🔥🔥");

console.log("INPUT ELEMENT:", input);
console.log("SEND BUTTON:", sendBtn);

if (sendBtn) {

    sendBtn.onclick = function (e) {

        e.preventDefault();

        console.log("🔥 SEND BUTTON CLICKED");

        sendMessage();

    };

}

if (input) {

    input.onkeydown = function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            console.log("🔥 ENTER PRESSED");

            sendMessage();

        }

    };

}
async function sendMessage() {

    console.log("🔥 SEND MESSAGE CALLED");

    const input = document.getElementById("userInput");

    const text = input.value.trim();

    console.log("MESSAGE:", text);
    console.log("FILE:", selectedFile);

    if (text === "" && !selectedFile) {
        return;
    }
    // =============================
    // USER MESSAGE
    // =============================

    const user = document.createElement("div");
    user.className = "user-message";

    if (text) {
        user.innerText = text;
    }

    if (selectedFile) {

        const fileInfo = document.createElement("div");

        fileInfo.innerText =
            `📎 ${selectedFile.name}`;

        user.appendChild(fileInfo);
    }

    messages.appendChild(user);

    input.value = "";


    // =============================
    // BOT MESSAGE
    // =============================

    const bot = document.createElement("div");
    bot.className = "bot-message";

    messages.appendChild(bot);


    // Typing animation

    const typing = document.createElement("div");

    typing.className = "typing";

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    bot.appendChild(typing);


    messages.scrollTop = messages.scrollHeight;


    // =============================
    // FORM DATA
    // =============================

    const formData = new FormData();

    formData.append("message", text);

    formData.append("character", character);


    if (selectedFile) {

        formData.append(
            "file",
            selectedFile
        );

    }


    // =============================
    // SEND TO FLASK
    // =============================

   try {

    const response = await fetch(
        "/api/chat",
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    console.log("🔥 SERVER RESPONSE:", data);

    if (!response.ok) {

        throw new Error(
            data.reply || 
            data.error || 
            `Server Error: ${response.status}`
        );

    }

        // Remove typing

        bot.innerHTML = "";


        // AI reply

        const reply =
            data.reply ||
            "No response received.";


        // Typewriter

        let i = 0;

        function typeWriter() {

            if (i < reply.length) {

                bot.textContent +=
                    reply.charAt(i);

                i++;

                messages.scrollTop =
                    messages.scrollHeight;

                setTimeout(
                    typeWriter,
                    20
                );

            }

        }

        typeWriter();


        // =============================
        // CLEAR FILE
        // =============================

        selectedFile = null;

        fileInput.value = "";


        const preview =
            document.querySelector(
                ".file-preview"
            );

        if (preview) {
            preview.remove();
        }


    }

   catch (error) {

    console.error(
        "🔥 GRAND LINE ERROR:",
        error
    );

    bot.innerText =
        "⚠️ " + error.message;

}

    messages.scrollTop =
        messages.scrollHeight;
}
// ===========================
// CHARACTER PARTICLES
// ===========================

const particleContainer=document.getElementById("particles");

let particleColors=[];

if(character==="luffy"){

particleColors=[

"#ff3131",

"#ff8800",

"#ffffff"

];

}

else if(character==="zoro"){

particleColors=[

"#00ff66",

"#33ff99",

"#ffffff"

];

}

else if(character==="nami"){

particleColors=[

"#00bfff",

"#66ddff",

"#ffffff"

];

}

else{

particleColors=[

"#FFD700",

"#fff08a",

"#ffffff"

];

}

for(let i=0;i<45;i++){

const p=document.createElement("div");

p.className="particle";

const size=Math.random()*6+2;

p.style.width=size+"px";

p.style.height=size+"px";

p.style.left=Math.random()*100+"%";

p.style.background=

particleColors[Math.floor(Math.random()*particleColors.length)];

p.style.animationDuration=(Math.random()*8+8)+"s";

p.style.animationDelay=(Math.random()*10)+"s";

particleContainer.appendChild(p);

}
//==========================
// CHARACTER SMOKE
//==========================

const smoke=document.getElementById("smoke");

let smokeColor="rgba(255,255,255,.30)";

if(character==="luffy"){

    smokeColor="rgba(255,90,90,.28)";

}

else if(character==="zoro"){

    smokeColor="rgba(0,255,90,.25)";

}

else if(character==="nami"){

    smokeColor="rgba(0,180,255,.25)";

}

else if(character==="sanji"){

    smokeColor="rgba(255,215,0,.25)";

}

for(let i=0;i<12;i++){

    const cloud=document.createElement("div");

    cloud.className="smoke";

    cloud.style.background=smokeColor;

    cloud.style.left=Math.random()*100+"%";

    cloud.style.animationDuration=(18+Math.random()*10)+"s";

    cloud.style.animationDelay=(Math.random()*15)+"s";

    smoke.appendChild(cloud);

}
