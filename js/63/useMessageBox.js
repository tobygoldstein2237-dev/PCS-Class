import showMessage from "./messageBox.js";

showMessage(
    'Is this enough homework?',
    ['Yes', 'No', 'Maybe'],
    usersChoice => console.log('You picked ' + usersChoice)
);

const msgInput = document.querySelector('#msg');

document.querySelector('#showMessage').addEventListener('submit', (e) => {
    e.preventDefault();
    showMessage(msgInput.value);
});