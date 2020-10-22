const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const button = document.querySelector('#myButton')


document.getElementById("myButton").onclick = function () {
    location.href = "/details";
};

function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 50);
    
}

function unfade2() {
    element= messageTwo
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 100);
    
}
function unfade3(){
    button.style.display = 'block'
}

unfade(messageOne)
setTimeout(unfade2,2000)
setTimeout(unfade3,5000)