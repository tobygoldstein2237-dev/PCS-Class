function text(str) {
    if (arguments.length === 0) {
        return element.textContent;
    } else {
        element.textContent = str;
    }
}



function addClass(className) {
    element.classList.add(className);
}