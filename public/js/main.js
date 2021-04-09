//code for main page
function funfact() {
    fetch ('https://uselessfacts.jsph.pl/random.json?language=en')
    .then((res) => res.json())
    .then((data) => {
        document.getElementById("fun_fact").innerHTML = "Did You Know: " + '"' + data.text.toString() + '"';
    });
}

//code for games page
function gamesList() {
    const app = document.getElementById("games")
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    app.appendChild(container)
    let gamesList = ["Blackjack", "Baccarat", "Minesweeper", "2048", "Tic-tac-toe", "Reversi", "Sudoku", 'Coin flipping', 'Rock paper scissors']
    gamesList.forEach(games => {
        fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${games}`)
        .then((res) => res.json())
        .then((data) => {

            const json = data.query.search[0];
            const url = `https://en.wikipedia.org/?curid=${json.pageid}`;
            const descSnippet = `${json.snippet}...`;

            container.insertAdjacentHTML(
                'beforeend',
                `<div class="card" onclick="location.href='index.html'">
                    <h2><a href="${url}">${games}</a></h2>
                    <p>${descSnippet}</p>
                </div>`
            )
        });
    })
}
//code for chat bot
const popup = document.querySelector('.chat-popup');
const chatBtn = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.send');
const micBtn = document.querySelector('.mic')
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('.input-area input');
const socket = io();

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
let recognised = false;

const synth = window.speechSynthesis;
micBtn.addEventListener("click", () => {
  if(recognised == false) 
    recognition.start();
  else if (recognised == true)
    synth.cancel();
});

recognition.onresult = function (event) {
  const last = event.results.length - 1;
  const text = event.results[last][0].transcript;

  let temp = `<div class="outgoing-msg">
  <span class="my-msg">${text}</span>
  <img src="img/me.png" class="avatar">
  </div>`;
  chatArea.insertAdjacentHTML("beforeend", temp);
  chatArea.scrollTop = chatArea.scrollHeight;
  socket.emit("chat message", text);
  recognised = true; 
};

const botReply = (text) => {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.pitch = 1;
  utterance.volume = 1;

  document.getElementById('mic').classList.remove('fa-microphone-alt');
  document.getElementById('mic').classList.add('fa-microphone-alt-slash')

  synth.speak(utterance);
  utterance.onend = function() {
    document.getElementById('mic').classList.remove('fa-microphone-alt-slash')
    document.getElementById('mic').classList.add('fa-microphone-alt');
    recognised = false;
  }
};

socket.on("bot reply", (text) => {
  let temp = `<div class="incoming-msg">
  <img src="img/bot.png" class="avatar">
  <span class="bot-msg">${text}</span>
  </div>`;
  chatArea.insertAdjacentHTML("beforeend", temp);
  chatArea.scrollTop = chatArea.scrollHeight;
  botReply(text);
});

submitBtn.addEventListener('click', () => {
  let userInput = inputElm.value;
  let temp = `<div class="outgoing-msg">
  <span class="my-msg">${userInput}</span>
  <img src="img/me.png" class="avatar">
  </div>`;

  chatArea.insertAdjacentHTML("beforeend", temp);
  chatArea.scrollTop = chatArea.scrollHeight;
  inputElm.value = "";
  socket.emit("chat message", userInput);
  recognised = true; 
})

inputElm.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keyCode === 13) {
    submitBtn.click();
  }
})

chatBtn.addEventListener('click', () =>{
  popup.classList.toggle('show');
})

//code for covid page