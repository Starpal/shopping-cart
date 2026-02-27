import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, addQuantity, subtractQuantity } from "../store/cartSlice";
import Recipe from "./Recipe";
import { RootState } from "../store/store";
import { Item } from "../types";

const Cart: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.addedItems);
  const dispatch = useDispatch();

  const handleRemove = (id: number) => {
    dispatch(removeItem(id));
  };

  const handleAddQuantity = (id: number) => {
    dispatch(addQuantity(id));
  };

  const handleSubtractQuantity = (id: number) => {
    dispatch(subtractQuantity(id));
  };

  let addedItems = items.length ? (
    items.map((item: Item) => {
      return (
        <li className="collection-item avatar" key={item.id}>
          <div className="item-img">
            <img src={item.img} alt={item.img} className="" />
          </div>
          <div className="item-desc">
            <span className="title">{item.title}</span>
            <p>{item.desc}</p>
            <p>
              <b>Price: {item.price}$</b>
            </p>
            <p>
              <b>Quantity: {item.quantity}</b>
            </p>
            <div className="add-remove">
              <Link to="/cart">
                <i
                  className="material-icons"
                  onClick={() => {
                    handleAddQuantity(item.id);
                  }}
                >
                  arrow_drop_up
                </i>
              </Link>
              <Link to="/cart">
                <i
                  className="material-icons"
                  onClick={() => {
                    handleSubtractQuantity(item.id);
                  }}
                >
                  arrow_drop_down
                </i>
              </Link>
            </div>
            <button
              className="waves-effect waves-light btn pink remove"
              onClick={() => {
                handleRemove(item.id);
              }}
            >
              Remove
            </button>
          </div>
        </li>
      );
    })
  ) : (
    <p>The Cart is Empty.</p>
  );

  return (
    <div className="container">
      <div className="cart">
        <h5>You have ordered:</h5>
        <ul className="collection">{addedItems}</ul>
      </div>
      <Recipe />
    </div>
  );
};

export default Cart;
