let user = JSON.parse(sessionStorage.user || null);
let loader = document.querySelector('.loader');

// checking user is logged in or not 
window.onload = () => {
    if(user){
        if(!compareToken(user.authToken, user.email)){
            location.replace('/login');
        }
    } else{
        location.replace('/login');
    }
}

// price inputs
const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
    if(discountPercentage.value > 100){
        discountPercentage.value = 90;
    } else{
        let discount = actualPrice.value * discountPercentage.value / 100;
        sellingPrice.value = actualPrice.value - discount;
    }
})
sellingPrice.addEventListener('input', () => {
    let discount = (sellingPrice.value / actualPrice.value) * 100;
    discountPercentage.value = discount;
})

// upload image handel 
let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = []; //will store all uploaded image paths


uploadImages.forEach((fileupload, index) => {
    fileupload.addEventListener('change', () => {
        const file = fileupload.files[0];
        let imageUrl;

        if(file.type.includes('image')){
            fetch('/s3url').then(res => res.json())
            .then(url => {
                fetch(url,{
                    method: 'PUT',
                    headers: new Headers({'Content-Type': 'multipart/form-data'}),
                    body: file
                }).then(res => {
                    imageUrl = url.split("?")[0];
                    imagePaths[index] = imageUrl;
                    let label= document.querySelector(`label[for=${fileupload.id}]`);
                    label.style.backgroundImage = `url(${imageUrl})`;
                    let productImage = document.querySelector('.product-image');
                    productImage.style.backgroundImage = `url(${imageUrl})`;
                })
            })
        } else{
            showAlert('upload image only');
        }
    })
})


// form submission
const productName = document.querySelector('#product-name');
const  shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');

let size = [];

const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const tac = document.querySelector('#tac');

const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

const storeSizes = () => {
    sizes = [];
    let sizeCheckBox = document.querySelectorAll('.size-checkbox');
    sizeCheckBox.forEach(item => {
        if(item.checked){
            sizes.push(item.value);
        }
    })
}

const validateForm = () => {
    if(!productName.value.length){
        return showAlert('enter product name');
    } else if(shortLine.value.length > 100 || shortLine.value.length < 10){
        return showAlert('short description must be between 10 to 100 letters long');
    } else if(!des.value.length){
        return showAlert('enter detail description about the product');
    } else if(!imagePaths.length){ //image link array
        return showAlert('Upload at least one product image');
    } else if(!sizes.length){ //size array
        return showAlert('select at lest one size');
    } else if(!actualPrice.value.length || !discount.value.length || !sellingPrice.value.length){
        return showAlert('you must add pricings');
    } else if(stock.value < 20){
        return showAlert('you must have at least 20 items in stocks');
    } else if(!tags.value.length){
        return showAlert('enter few tags to help ranking your product in search');
    } else if(!tac.checked){
        return showAlert('you must agree to our terms and conditaions');
    }
    return true;
}

const productData = () => {
    return data = {
        name: productName.value,
        shortDes: shortLine.value,
        des: des.value,
        images: imagePaths,
        sizes: sizes,
        actualPrice: actualPrice.value,
        discount: discountPercentage.value,
        sellPrice: sellingPrice.value,
        stock: stock.value,
        tags: tags.value,
        tac: tac.checked,
        email: user.email
    }
}

addProductBtn.addEventListener('click', () => {
    storeSizes();
    // validate form 
    if(validateForm()){
        loader.style.display = 'block'
        let data = productData();
        sendData('/add-product', data);
    }
})

// save draft btn 
saveDraft.addEventListener('click', () => {
    // store sizes 
    storeSizes();
    // check for product name 
    if(!productName.value.length){
        showAlert('enter product name');
    } else{
        let data = productData();
        data.draft = true;
        sendData('/add-product', data);
    }
})