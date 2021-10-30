const createNav = () =>{
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
        <div class="nav">
            <a href="/"><img src="img/dark-logo-c.png" class="brand-logo" alt="logo"></a>
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search brand, product">
                    <button class="search-btn">search</button>
                </div>
                <a>
                    <img src="img/user.png" id="user-img" alt="user">
                    <div class="login-logout-popup hide">
                        <p class="account-info">Log in as, name</p>
                        <button class="btn" id="user-btn">log out</button>
                    </div>
                </a>
                <a href="#"><img src="img/cart.png" alt="cart"></a>
            </div>
        </div>
        <ul class="links-contaner">
            <li class="link-items"><a href="#" class="link">Home</a></li>
            <li class="link-items"><a href="#" class="link">Women</a></li>
            <li class="link-items"><a href="#" class="link">Men</a></li>
            <li class="link-items"><a href="#" class="link">kids</a></li>
            <li class="link-items"><a href="#" class="link">Accessories</a></li>
        </ul>
    `;
}
createNav();

//nav popup
const userImageButton = document.querySelector('#user-img');
const userPop = document.querySelector('.login-logout-popup');
const popuptext = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () => {
    userPop.classList.toggle('hide');
})

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if(user != null){
        // means user is logged in
        popuptext.innerHTML = `log in as, ${user.namee}`;
        actionBtn.innerHTML = 'log out';
        actionBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        })
    } else{
        // user is logged out
        popuptext.innerHTML = 'log in to place order';
        actionBtn.innerHTML = 'log in';
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        })
    }
}