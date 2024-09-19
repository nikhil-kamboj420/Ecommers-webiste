//  ################## fetching data of products from API ####################
const fetchProducts = async () => {
  try {
    let response = await fetch("./api/products.json");
    let products = await response.json();
    return products;
  } catch (error) {
    console.log(` failed to fetch the data ${error} `);
  }
};

const productsContainer = document.querySelector(".product-container");
const productsTemplate = document.getElementById("productTemplate");

fetchProducts()
  .then((products) => {
    products.forEach((curProducts) => {
      const { id, name, category, price, stock, description, image, alt } =
        curProducts;
      
      const productsClone = document.importNode(productsTemplate.content, true);
      productsClone.querySelector(".category").textContent = category;
      productsClone.querySelector(".productName").textContent = name;
      productsClone.querySelector(".productPrice").textContent = ` ${price}`;
      productsClone.querySelector(
        ".productActualPrice"
      ).textContent = `₹ ${Math.round(price * 3)}`;
      productsClone.querySelector(".productStock").textContent = stock;
      productsClone.querySelector(".productDescription").textContent =
        description;
      productsClone.querySelector(".productImage").src = image;
      productsClone.querySelector(".productImage").alt = alt;

      productsClone.querySelector("#cardValue").setAttribute("id", `card${id}`);
  
      productsClone.querySelector(".stockElement").addEventListener("click", (event)=>{
        toggleProductsQuantity(event, id, stock);
      })

      productsClone.querySelector(".add-to-cart-button").addEventListener("click", (event)=>{
        addToCart(event, id, stock);
      })
      
    productsContainer.append(productsClone);

    });
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
//* ############## data fetching processing completed ###############

//_ ### adding functionality of increasing and decreasing products ###
const toggleProductsQuantity = (event, id, stock)=>{
  let curProductElem = productsContainer.querySelector(`#card${id}`)
  curProductElem.querySelector(".stockElement");
  let productQuantity = curProductElem.querySelector(".productQuantity")
  let quantity = productQuantity.getAttribute("data-quantity") || 1;
  quantity = parseInt(quantity);
  if(event.target.className === "cartIncrement"  ){
    if(quantity < stock){
      quantity += 1;
    }else if (quantity == stock){
      quantity = stock;
    }
  }
  if(event.target.className === "cartDecrement"  ){
    if(quantity > 1 ){
      quantity -= 1;
    }
  }
  productQuantity.innerText = quantity;

  productQuantity.setAttribute("data-quantity", quantity);

}


//_ ############# addToCart button functionality  #################
// ########### storing data in the localStorage ##########

const addToCart = (event, id, stock)=>{
let arrLocalStorageProduct= getCartProductFromLS();
let curProductCartELem = productsContainer.querySelector(`#card${id}`);
let quantity = curProductCartELem.querySelector(".productQuantity").innerText;
let price = curProductCartELem.querySelector(".productPrice").innerText;
price = price.replace("₹", "");
price = price * quantity;
quantity = Number(quantity)
arrLocalStorageProduct.push({id, quantity, price});

localStorage.setItem("cartProductsLS", JSON.stringify(arrLocalStorageProduct));
}

const getCartProductFromLS = ()=>{
let cartProducts = localStorage.getItem("cartProductsLS")
if(!cartProducts){
  return [];
}
cartProducts = JSON.parse(cartProducts);
return cartProducts;
}