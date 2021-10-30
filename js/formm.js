// const loader = document.querySelector('.loader');

// // select inputs 
// const submitBtn = document.querySelector('.submit-btn');
// const namee = document.querySelector('#namee');
// const email = document.querySelector('#email');
// const password = document.querySelector('#password');
// const number = document.querySelector('#number');
// const tac = document.querySelector('#terms-and-con');
// const notification = document.querySelector('#notification');

// submitBtn.addEventListener('click', () => {
//     if(namee.value.length <3){
//         showAlert('name must be 3 letters long');
//     } else if(!email.value.length){
//         showAlert('enter your email')
//     } else if (password.value.length <12){
//         showAlert('Password should be 12 letters long');
//     } else if (!number.value.length){
//         showAlert('Enter Your Phone Number');
//     } else if (!Number(number.value) || number.value.length < 10){
//         showAlert('Invalid Number, Please Enter Valid One')
//     } else if(!tac.checked){
//         showAlert('you must agree to the terms and contitions')
//     } else{
//         // submit form 
//         loader.style.display = 'block';
//         sendData('/signup',{
//             namee: namee.value,
//             email: email.value,
//             password: password.value,
//             number: number.value,
//             tac: tac.checked,
//             notification: notification.checked,
//             seller: false
//         })
//     }
// })

// // send data function 
// const sendData = (path, data) => {
//     fetch(path, {
//         method: 'post',
//         headers: new Headers({'Content-Type': 'application/json'}),
//         body: JSON.stringify(data)
//     }).then((res) => res.json())
//     .then(response => {
//         // processData(response);
//         console.log(response);
//     })
// }
// // const processData = (data) =>{
// //     loader.style.display = null;
// //     if(data.alert){
// //         showAlert(data.alert);
// //     }
// // }

// const showAlert = (msg) => {
//     let alertBox = document.querySelector('.alert-box');
//     let alertMsg = document.querySelector('.alert-msg');
//     alertMsg.innerHTML = msg;
//     alertBox.classList.add('show');
//     setTimeout(() => {
//         alertBox.classList.remove('show');
//     }, 2000);
// }