import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { RootState } from "../store/store";
import { Item } from "../types";

const Home: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleClick = (id: number) => {
    dispatch(addToCart(id));
  };

  let itemList = items.map((item: Item) => {
    return (
      <div className="card" key={item.id}>
        <div className="card-image">
          <img src={item.img} alt={item.title} />
          <span className="card-title">{item.title}</span>
          <span
            className="btn-floating halfway-fab waves-effect waves-light pink"
            onClick={() => {
              handleClick(item.id);
            }}
          >
            <i className="material-icons">add</i>
          </span>
        </div>
        <div className="card-content">
          <p>{item.desc}</p>
          <p>
            <b>Price: {item.price}$</b>
          </p>
        </div>
      </div>
    );
  });

  return (
    <div className="container">
      <h3 className="center">Our items</h3>
      <div className="box">{itemList}</div>
    </div>
  );
};

export default Home;
