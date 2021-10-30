window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(compareToken(user.authToken, user.email)){
            location.replace('/')
        }
    }
}

const loader = document.querySelector('.loader');

// select inputs 
const submitBtn = document.querySelector('.submit-btn');
const namee = document.querySelector('#namee') || null;
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number') || null;
const tac = document.querySelector('#terms-and-con') || null;
const notification = document.querySelector('#notification') || null;

submitBtn.addEventListener('click', () => {
    if(namee != null){ // sign up page
        if(namee.value.length <3){
            showAlert('name must be 3 letters long');
        } else if(!email.value.length){
            showAlert('enter your email');
        } else if (password.value.length <12){
            showAlert('password should be 12 letters long');
        } else if (!number.value.length){
            showAlert('enter your number');
        } else if (!Number(number.value) || number.value.length < 10){
            showAlert('invalid number, please enter valid one');
        } else if(!tac.checked){
            showAlert('you must agree to our terms & conditions');
        } else{
            // submit form 
            loader.style.display = 'block';
            sendData('/signup',{
                namee: namee.value,
                email: email.value,
                password: password.value,
                number: number.value,
                tac: tac.checked,
                notification: notification.checked,
                seller: false
            })
        }
    } else{
        // login page
        if(!email.value.length || !password.value.length){
            showAlert('fill all the inputs')
        } else{
            loader.style.display = 'block';
            sendData('/login',{
                email: email.value,
                password: password.value,
            })
        }
    }
})