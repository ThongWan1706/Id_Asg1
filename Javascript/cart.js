//Shopping Cart codes

const cartkey = 'shoppingCartList';
const selector = '#cartText'; 
const promocode = 'NEWKEY15';
const discount = 0.15;
const promopast = 'promoApplied';

//Get a new list
function getCartList() {
    return JSON.parse(localStorage.getItem(cartkey)) || [];
}

//Add items in the cart
function addItem(buttonElement) {
    // Get the product details (ID, Name, Price) from the HTML
    const productData = buttonElement.closest('.product-detail-main-section').dataset; 
    
    let cartList = getCartList();
    const itemIndex = cartList.findIndex(item => item.id === productData.id); 

    if (itemIndex > -1) {
        cartList[itemIndex].quantity++; 
    } else { 
        cartList.push({ 
            id: productData.id, 
            name: productData.name, 
            price: parseFloat(productData.price), 
            quantity: 1 
        }); 
    }

    saveCartList(cartList);
    showAlert(`${productData.name} has been added to your cart!`);
}

//Remove item from the list
function removeItem(itemId) {
    let newCartList = getCartList().filter(item => item.id !== itemId);
    saveCartList(newCartList);
    displayCartItems(); 
}

//Save the list and update the cart
function saveCartList(cartList) {
    localStorage.setItem(cartkey, JSON.stringify(cartList));
    updateCartCount();
}

//Count all items and update the cart
function updateCartCount() {
    const itemList = getCartList();
    // Calculate the total number of items
    const totalItems = itemList.reduce((total, item) => total + item.quantity, 0); 
    
    const iconElement = document.querySelector(selector);
    if (iconElement) {
        iconElement.textContent = `🛒 Cart (${totalItems})`; 
    }
}

//If have discount code
function applyPromoCode() {
    const inputElement = document.getElementById('promoCode');
    const messageElement = document.getElementById('promoMessage');

    // Check whether the code exist
    if (!inputElement || !messageElement) {
        displayCartItems(); 
        return; 
    }

    const input = inputElement.value.toUpperCase().trim();
    
    if (input === promocode) {
        localStorage.setItem(promopast, 'true');
        messageElement.textContent = `SUCCESS: 15% discount applied!`;
        messageElement.style.color = '#388e3c'; 
    } else {
        localStorage.removeItem(promopast); 
        messageElement.textContent = 'Invalid promo code.';
        messageElement.style.color = '#d32f2f'; 
    }
    displayCartItems(); 
}

//Display the items in the cart
function displayCartItems() {
    const cartItems = getCartList();
    const listContainer = document.getElementById('cartList');
    const summaryContainer = document.getElementById('cartSummary');

    // If the cart is empty
    if (cartItems.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center;">Your cart is empty. Start shopping now!</p>';
        summaryContainer.innerHTML = '';
        return;
    }

    let htmlOutput = '';
    let grandTotal = 0;
    let totalItems = 0; 

    cartItems.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        grandTotal += itemSubtotal;
        totalItems += item.quantity; 
    
        htmlOutput += `
            <div class="cart-item">
                <span class="item-details">${item.quantity}x ${item.name}</span>
                <span class="item-subtotal">$${itemSubtotal.toFixed(2)}</span>
                <button onclick="removeItem('${item.id}')" class="remove-button">&times;</button>
            </div>
        `;
    });

    listContainer.innerHTML = htmlOutput; 

    // Promo code checking
    const isPromoApplied = localStorage.getItem(promopast) === 'true';
    let discountAmount = 0;

    // Get the promo code and check if they exist first
    const inputElement = document.getElementById('promoCode');
    const messageElement = document.getElementById('promoMessage');

    if (isPromoApplied) {
        discountAmount = grandTotal * discount;
        
        if (inputElement) inputElement.value = promocode;
        if (messageElement) {
             messageElement.textContent = `15% Discount Applied!`;
             messageElement.style.color = '#388e3c';
        }
    } else {
        if (messageElement) messageElement.textContent = '';
        if (inputElement) inputElement.value = '';
    }

    const finalTotal = grandTotal - discountAmount;

    summaryContainer.innerHTML = `
        <div class="summary-line">
            <span>Subtotal:</span>
            <span>$${grandTotal.toFixed(2)}</span>
        </div>
        ${isPromoApplied ? 
            `<div class="summary-line discount">
                <span>Discount (15%):</span>
                <span>-$${discountAmount.toFixed(2)}</span>
            </div>` 
            : ''
        }
        <div class="summary-line grand-total">
            <h3>Grand Total:</h3>
            <h3>$${finalTotal.toFixed(2)}</h3>
        </div>
        <button onclick="checkout()" class="checkout-button">Proceed to Contact &rarr;</button>
    `;
}

//Done with the order
function checkout() {
    saveCartList([]); 
    alert("Order complete! Please take a screenshot of your ordered list and go to the Contact page to finalize the details!");
    window.location.href = 'contact.html';
}


// Run the displayCartItems function only on the Cart page
if (document.title.includes('Cart')) {
    document.addEventListener('DOMContentLoaded', displayCartItems);
}

// Ensure the cart count is always updated for every page
document.addEventListener('DOMContentLoaded', updateCartCount);