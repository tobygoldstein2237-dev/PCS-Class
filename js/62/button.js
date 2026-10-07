let count = 1;

function addButton() {
    count++;

    const newButton = document.createElement("button");
    newButton.innerText = count;

    newButton.addEventListener("click", addButton);

    document.body.appendChild(newButton);
}

const myButton = document.getElementById("myButton");
myButton.addEventListener("click", addButton);