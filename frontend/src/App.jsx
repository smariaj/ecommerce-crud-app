import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");


  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  // ADD TO CART
  const addToCart = (product) => {

    const existingProduct = cart.find(
      (item) => item._id === product._id
    );


    if (existingProduct) {

      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([
        ...cart,
        {
          ...product,
          cartQuantity: 1,
        },
      ]);
    }
  };


  // REMOVE FROM CART
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);
  };


  // TOTAL PRICE
  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  );


  // PLACE ORDER
  const placeOrder = async () => {

    if (!address) {
      alert("Please enter address");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          products: cart,
          totalAmount,
          address,
          paymentMethod,
        }
      );

      alert("Order placed successfully");

      setCart([]);

      setAddress("");

      fetchProducts();

    } catch (error) {
      console.log(error);

      alert("Error placing order");
    }
  };


  return (
    <div className="container">

      <h1>E-Commerce App</h1>


      <div className="products-section">

        <h2>Products</h2>

        <div className="products">

          {products.map((product) => (

            <div className="card" key={product._id}>

              <h3>{product.name}</h3>

              <p>Price: ₹{product.price}</p>

              <p>Category: {product.category}</p>

              <p>Stock: {product.quantity}</p>

              <button
                onClick={() => addToCart(product)}
              >
                Add To Cart
              </button>

            </div>
          ))}
        </div>
      </div>


      <div className="cart-section">

        <h2>Cart</h2>

        {cart.map((item) => (

          <div className="cart-item" key={item._id}>

            <p>
              {item.name} x {item.cartQuantity}
            </p>

            <button
              onClick={() =>
                removeFromCart(item._id)
              }
            >
              Remove
            </button>

          </div>
        ))}


        <h3>Total: ₹{totalAmount}</h3>


        <textarea
          placeholder="Enter Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />


        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        >
          <option>Cash on Delivery</option>

          <option>UPI</option>

          <option>Card</option>
        </select>


        <button onClick={placeOrder}>
          Purchase
        </button>

      </div>

    </div>
  );
}

export default App;