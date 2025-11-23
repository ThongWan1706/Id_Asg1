//Shopping Cart codes

const CART_KEY = 'shoppingCartList';
const ICON_SELECTOR = '#cartText'; 


//Get a new list
function getCartList() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

//Save the list and update the cart
function saveCartList(cartList) {
    localStorage.setItem(CART_KEY, JSON.stringify(cartList));
    updateCartCount();
}

//Count all items and update the cart
function updateCartCount() {
    const itemList = getCartList();
    // Calculate the total number of items
    const totalItems = itemList.reduce((total, item) => total + item.quantity, 0); 
    
    const iconElement = document.querySelector(ICON_SELECTOR);
    if (iconElement) {
        // NOTE: Make sure the HTML element has id="cartText" (lowercase t)
        iconElement.textContent = `🛒 Cart (${totalItems})`;
    }
}

//Add items in the cart
function addItem(buttonElement) {
    // Get the product details (ID, Name, Price) from the HTML
    // Using the corrected selector for the product section
    const productData = buttonElement.closest('.product-detail-main-section').dataset; 
    
    let cartList = getCartList();
    const itemIndex = cartList.findIndex(item => item.id === productData.id); 

    if (itemIndex > -1) {
        cartList[itemIndex].quantity++; // If item is already in the cart, add on the quantity
    } else { 
        // If not, add it to the list
        cartList.push({ 
            id: productData.id, 
            name: productData.name, 
            price: parseFloat(productData.price), 
            quantity: 1 
        }); 
    }

    saveCartList(cartList);
    alert(`${productData.name} has been added to your cart!`);
}

//Remove item from the list
function removeItem(itemId) {
    let newCartList = getCartList().filter(item => item.id !== itemId);
    saveCartList(newCartList);
    displayCartItems(); // Show the updated list immediately
}

//Done with the order
function checkout() {
    saveCartList([]); // Clear the list by saving an empty list
    alert("Order complete! Please go to the Contact page to finalize details.");
    window.location.href = 'contact.html';
}


//Display the list of items in the cart
function displayCartItems() {
    const cartItems = getCartList();
    const listContainer = document.getElementById('cartList');
    const summaryContainer = document.getElementById('cartSummary');
    
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

    // Make the listing better in the page
    summaryContainer.innerHTML = `
        <div class="summary-line">
            <span>Total Items:</span>
            <span>${totalItems}</span>
        </div>
        <div class="summary-line grand-total">
            <h3>Grand Total:</h3>
            <h3>$${grandTotal.toFixed(2)}</h3>
        </div>
        <button onclick="checkout()" class="checkout-button">Proceed to Contact &rarr;</button>
    `;
}


// Run the displayCartItems function only on the Cart page
if (document.title.includes('Cart')) {
    document.addEventListener('DOMContentLoaded', displayCartItems);
}

// Ensure the cart count is always updated for every page
document.addEventListener('DOMContentLoaded', updateCartCount);