import React, { createContext, useContext, useReducer } from 'react';
const CartContext = createContext();

const initialState = {
  cartItems: [],
  total: 0,
};
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const itemExists = state.cartItems.find(item => item.id === action.payload.id);
      let updatedCart;

      if (itemExists) {
        updatedCart = state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cartItems, { ...action.payload, quantity: 1 }];
      }

      const total = updatedCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...state, cartItems: updatedCart, total };
    }

    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cartItems.filter(item => item.id !== action.payload);
      const total = updatedCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...state, cartItems: updatedCart, total };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
