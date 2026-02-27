import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addShipping, subShipping } from '../store/cartSlice';
import { RootState } from '../store/store';

const Recipe: React.FC = () => {
    const [isShippingChecked, setIsShippingChecked] = useState(false);
    const total = useSelector((state: RootState) => state.cart.total);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            if (isShippingChecked) {
                dispatch(subShipping());
            }
        }
    }, [isShippingChecked, dispatch]);

    const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
        setIsShippingChecked(e.target.checked);
        if (e.target.checked) {
            dispatch(addShipping());
        } else {
            dispatch(subShipping());
        }
    }

    return (
        <div className="container">
            <div className="collection">
                <li className="collection-item">
                    <label>
                        <input type="checkbox" checked={isShippingChecked} onChange={handleChecked} />
                        <span>Shipping(+6$)</span>
                    </label>
                </li>
                <li className="collection-item"><b>Total: {total} $</b></li>
            </div>
            <div className="checkout">
                <button className="waves-effect waves-light btn">Checkout</button>
            </div>
        </div>
    );
}

export default Recipe;