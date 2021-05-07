const chatForm = document.getElementById('chat-input');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// On recupere l'id de la salle et le pseudo de l'utilisateur depuis l'url
const { pseudo, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});
const socket = io();

/* Transfert vers la bonne salle */
socket.emit('EnterRoom', { pseudo, room });


socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

/* récuperation des messages */
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);


  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* */
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  /* recuperation du contenu du message a envoyer */
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  /* envoie du message par socket.io */ 
  socket.emit('chatMessage', msg);

  /* suppression du contenu de l'input */
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

/* affichage du message a la fin de la liste de  l'historique*/
function outputMessage(message) {
  const div = document.createElement('div');
  const p = document.createElement('p');
  div.classList.add('message');
  const para = document.createElement('p');

  p.classList.add('meta');
  p.innerText = message.pseudo;
  p.innerHTML += `<span>${message.time}</span>`;

  div.appendChild(p);

  para.classList.add('text');
  para.innerText = message.text;

  div.appendChild(para);

  document.querySelector('.chat-messages').appendChild(div);
}

/* Ajout du nom de la salle dans la barre laterale */
function outputRoomName(room) {
  roomName.innerText = room;
}

/* Ajout de l'utilisateur dans la liste des utilisateurs connectés */
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const newLi = document.createElement('li');
    newLi.innerText = user.pseudo;
    userList.appendChild(newLi);
  });
}

/*Quitter la salle a l'appuie du bouton */
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Voulez vous vraiment quitter la salle de chat ?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});