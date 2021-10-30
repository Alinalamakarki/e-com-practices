// importing package
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
// const { AppStore } = require('firebase-admin/lib/app/lifecycle');

// fire basse
let serviceAccount = require("./it-s-our-shop-firebase-adminsdk-d98wx-da62912230.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// aws config 
const aws = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// aws parameters
const region = "ap-south-1";
const bucketName = "ecom-website-test";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
})

// init s3 
const s3 = new aws.S3();

// generate image upload link 
async function generateUrl(){
    let date = new Date();
    let id = parseInt(Math.random() * 1000000000000);

    const imageName = `${id}${date.getTime()}.jpg`;

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 300, // expire in sec
        ContentType: 'image/jpeg'
    })
    const uploadsUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadsUrl;
}

// declare static path
let staticPath = path.join(__dirname, "public");

// intializing express.js
const app = express();


// middlwwares
app.use(express.static(staticPath));
app.use(express.json());

// routes
// home routes
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})

app.get('/product', (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
})

// signup root 
app.get('/signup', (_req, res) =>{
    res.sendFile(path.join(staticPath, "signup.html"));
})


app.post('/signup', (req, res) => {
    let { namee, email, password, number, tac, notification } = req.body;

    if(namee.length <3){
        return res.json({'alert': 'name must be 3 letters long'});
    } else if(!email.length){
        return res.json({'alert': 'enter your email'});
    } else if (password.length <12){
        return res.json({'alert': 'password should be 12 letters long'});
    } else if (!number.length){
        return res.json({'alert': 'enter your number'});
    } else if (!Number(number) || number.length < 10){
        return res.json({'alert': 'invalid number, please enter valid one'});
    } else if(!tac){
        return res.json({'alert': 'you must agree to our terms & conditions'});
    } 

    // store user in db 
    db.collection('users').doc(email).get()
    .then(user => {
        if(user.exists){
            return res.json({'alert': 'email already exists'});
        } else{
            // encrypt the password before storing it
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    req.body.password = hash;
                    db.collection('users').doc(email).set(req.body)
                    .then(data => {
                        res.json({
                            namee: req.body.namee,
                            email: req.body.email,
                            seller: req.body.seller,
                        })
                    })
                })
            })
        }
    })
})

// login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;

    if(!email.length || !password.length){
        return res.json({'alert': 'fill all the inputs'})
    }

    db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists){ // if email does not exist
            return res.json({'alert': 'log in email does not exist'})
        } else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        namee: data.namee,
                        email: data.email,
                        seller: data.seller
                    })
                } else{
                    return res.json({'alert': 'password incorrect'});
                }
            })
        }
    })
})

// seller route 
app.get('/seller', (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
})

app.post('/seller', (req, res) =>{
    let{ namee, about, address, number, tac, legit, email } = req.body;
    if(!namee.length || !address.length || !about.length || number.length < 10 || !Number(number)){
        return res.json({'alert': 'some information(S) is/are invalid'});
    } else if (!tac || !legit){
        return res.json({'alert': 'you must agree to our terms and conditions'})
    } else{
        // update users seller status hear
        db.collection('sellers').doc(email).set(req.body)
        .then(data => {
            db.collection('users').doc(email).update({
                seller: true
            }).then(data =>{
                res.json(true);
            })
        })
    }
})

// add product 
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(staticPath, "addproduct.html"));
})
app.get('/add-product/:id', (req, res) => {
    res.sendFile(path.join(staticPath, "addproduct.html"));
})



// get the upload link 
app.get('/s3url', (req, res) => {
    generateUrl().then(url => res.json(url));
})

// add product 
app.post('/add-product', (req, res) => {
    let {name, shortDes, des, images, sizes, actualPrice, discount, sellPrice, stock, tags, tac, email, draft }  = req.body;

    // validation
    if(!draft){
        if(!name.length){
            return res.json({'alert': 'enter product name'});
        } else if(shortDes.length > 100 || shortDes.length < 10){
            return res.json({'alert': 'short description must be between 10 to 100 letters long'});
        } else if(!des.length){
            return res.json({'alert': 'enter detail description about the product'});
        } else if(!images.length){ //image link array
            return res.json({'alert': 'Upload at least one product image'});
        } else if(!sizes.length){ //size array
            return res.json({'alert': 'select at lest one size'});
        } else if(!actualPrice.length || !discount.length || !sellPrice.length){
            return res.json({'alert': 'you must add pricings'});
        } else if(stock < 20){
            return res.json({'alert': 'you must have at least 20 items in stocks'});
        } else if(!tags.length){
            return res.json({'alert': 'enter few tags to help ranking your product in search'});
        } else if(!tac){
            return res.json({'alert': 'you must agree to our terms and conditaions'});
        }
    }

    // add product 
    let docName = `${name.toLowerCase()}-${Math.floor(Math.random() * 500)}`;
    db.collection('products').doc(docName).set(req.body)
    .then(data => {
        res.json({'product': name});
    })
    .catch(err =>{
        return res.json({'alert': 'some error occured Try again'});
    })
})

// get product 
app.post('/get-products', (req, res) => {
    let{ email } = req.body;
    let docRef = db.collection('products').where('email', '==', email);

    docRef.get()
    .then(products => {
        if(products.empty){
        return res.json('no products');
        }
        let productArr = [];
        products.forEach(item => {
            let data = item.data();
            data.id = item.id;
            productArr.push(data);
        })
        res.json(productArr)
    })
})

app.post('/delete-product', (req, res) => {
    let { id } = req.body;

    db.collection('products').doc(id).delete()
    .then(data => {
        res.json('success');
    }) .catch(err =>{
        res.json('err');
    })
})

// 404 routes
app.get('/404', (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
})
app.use((req, res) => {
    res.redirect('/404');
})


app.listen(3000, () => {
    console.log('listening on port 3000.......');
});