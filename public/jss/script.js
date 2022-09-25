'use strict';

// all initial elements
const payAmountBtn = document.querySelector('#payAmount');
const decrementBtn = document.querySelectorAll('#decrement');
const quantityElem = document.querySelectorAll('#quantity');
const incrementBtn = document.querySelectorAll('#increment');
const priceElem = document.querySelectorAll('#price');
const subtotalElem = document.querySelector('#subtotal');
const taxElem = document.querySelector('#tax');
const totalElem = document.querySelector('#total');


// loop: for add event on multiple `increment` & `decrement` button
for (let i = 0; i < incrementBtn.length; i++) {

  incrementBtn[i].addEventListener('click', function () {

    // collect the value of `quantity` textContent,
    // based on clicked `increment` button sibling.
    let increment = Number(this.previousElementSibling.textContent);

    // plus `increment` variable value by 1
    increment++;

    // show the `increment` variable value on `quantity` element
    // based on clicked `increment` button sibling.
    this.previousElementSibling.textContent = increment;

    totalCalc();

  });


  decrementBtn[i].addEventListener('click', function () {

    // collect the value of `quantity` textContent,
    // based on clicked `decrement` button sibling.
    let decrement = Number(this.nextElementSibling.textContent);

    // minus `decrement` variable value by 1 based on condition
    decrement <= 1 ? 1 : decrement--;

    // show the `decrement` variable value on `quantity` element
    // based on clicked `decrement` button sibling.
    this.nextElementSibling.textContent = decrement;

    totalCalc();

  });

}



// function: for calculating total amount of product price
const totalCalc = function () {

  // declare all initial variable
  const tax = 0.05;
  let subtotal = 0;
  let totalTax = 0;
  let total = 0;

  // loop: for calculating `subtotal` value from every single product
  for (let i = 0; i < quantityElem.length; i++) {

    subtotal += Number(quantityElem[i].textContent) * Number(priceElem[i].textContent);

  }

  // show the `subtotal` variable value on `subtotalElem` element
  subtotalElem.textContent = subtotal.toFixed(2);

  // calculating the `totalTax`
  totalTax = subtotal * tax;

  // show the `totalTax` on `taxElem` element
  taxElem.textContent = totalTax.toFixed(2);

  // calcualting the `total`
  total =  total;

  // show the `total` variable value on `totalElem` & `payAmountBtn` element
  totalElem.textContent = total.toFixed(2);
  payAmountBtn.textContent = total.toFixed(2);

}


// logic for cart 
const carticon = document.querySelector('.fa-cart-shopping ');
const wholecartwindow = document.querySelector('.whole-cart-window')
wholecartwindow.inWindow = 0;

// carticon.addEventListener('mouseover',()=>{
//     if( wholecartwindow.classList.contains('hide')){
//         wholecartwindow.classList.remove('hide'); 
//     }

// })
// carticon.addEventListener('mouseleave',()=>{
//     setTimeout(()=>{
//         if(wholecartwindow.inWindow===0){
//             wholecartwindow.classList.add('hide');
//         }
//     },200)
// })

// wholecartwindow.addEventListener ( 'mouseover' , ()=> {

//     wholecartwindow.inWindow = 1
// } )

// wholecartwindow.addEventListener ( 'mouseleave' , ()=> {
//    wholecartwindow.inWindow = 0
//    wholecartwindow.classList.add ('hide' )
// } )


//logic for adding cart item 
class CartItem{
    constructor (name  ,img , price){
        this.name = name;
        this.img = img;
        this.price = price;
        this.quantity = 1;
        // this.desc = desc

    }
}

class LocalCart{
    static key = 'cartItems';
    
    static getLocalCartItems(){
        let cartMap = new Map()
        const cart = localStorage.getItem( LocalCart.key);
        if(cart==null || cart.length==0){
            return cartMap;
        }
        return new Map(Object.entries(JSON.parse(cart)))
    }

    static addItemToLocalCart(id,item){
        //if element already presnet then update its quantity
        let cart = LocalCart.getLocalCartItems()
         if(cart.has(id)){
            let mapItem = cart.get(id)
            mapItem.quantity +=1
            cart.set(id, mapItem)
         }
         //if new item is being added then simply add it to the cartMap
         else
             cart.set(id,item)
         
             localStorage.setItem(LocalCart.key,  JSON.stringify(Object.fromEntries(cart)))
             updateCartUI()

    }
    static removeItemFromCart(id){
        let cart = LocalCart.getLocalCartItems()
        if(cart.has(id)){
            let  mapItem = cart.get(id)
            if(mapItem.quantity>1){
                mapItem.quantity-=1
                cart.set(id,mapItem)
            }
            else{
                cart.delete(id)
            }

        }
        if(cart.length===0){
            localStorage.clear()
        }
        else{
            localStorage.setItem( LocalCart.key, JSON.stringify(Object.fromEntries(cart)))
            updateCartUI()
        }
    }
    
}

const addtocart = document.querySelectorAll('.addtocart');
addtocart.forEach((btn) => {
    
    btn.addEventListener('click',addItemFunction);
    
    
})

const cartIcon = document.querySelector('.fa-cart-shopping')
const wholeCartWindow = document.querySelector('.whole-cart-window')

function addItemFunction(e){ 
    const id = e.target.parentElement.parentElement.getAttribute("data-id");
    const img = e.target.parentElement.previousElementSibling.src;
    const name = e.target.parentElement.children[0].textContent;
    let price = e.target.parentElement.children[1].textContent;
    price = price.replace("$",'');
    const item = new CartItem(name , img , price)
    LocalCart.addItemToLocalCart(id,item);
    console.log(e.target);
    console.log(id);
    console.log(img);
    console.log(name);
    console.log(price);
}
function updateCartUI(){
    const cartWrapper = document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=""
    const items = LocalCart.getLocalCartItems()
    if(items === null) return
    let count = 0
    let total = 0
    for(const [key, value] of items.entries()){
        const cartItem = document.createElement('div')
        cartItem.classList.add('cart-item')
        let price = value.price*value.quantity
        price = Math.round(price*100)/100
        count+=1
        total += price
        total = Math.round(total*100)/100
        cartItem.innerHTML =
        `
        <img src="${value.img}"> 
    
        <div class="details">
          <h3>${value.name}</h3>
        
          <span class="quantity">Quantity:  ${value.quantity}</span>
          <span class="price">price $: ${price}</span>
        </div>
        <div class="cancel"><i class="fa-solid fa-rectangle-xmark"></i></div>
      </div>
        `
       cartItem.lastElementChild.addEventListener('click', ()=>{
           LocalCart.removeItemFromCart(key)
       })
        cartWrapper.append(cartItem)
    }

    if(count > 0){
        cartIcon.classList.add('non-empty')
        let root = document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal = document.querySelector('.subtotal')
        subtotal.innerHTML = `Pay: $${total}`
    }
    else
    cartIcon.classList.remove('non-empty')
}
document.addEventListener('DOMContentLoaded', ()=>{updateCartUI()})