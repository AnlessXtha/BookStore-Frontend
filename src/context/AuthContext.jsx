import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  const updateCart = (items) => {
    setCart(items);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.bookId === item.bookId);
      let updatedCart;
      if (existing) {
        updatedCart = prevCart.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updatedCart = [...prevCart, item];
      }
      return updatedCart;
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        updateUser,
        cart,
        updateCart,
        addToCart,
        removeFromCart,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
