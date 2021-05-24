import React from 'react';
import PropTypes from 'prop-types';
import cn from 'class-names';
import { ACTION_ITEM, ACTION_USER, ACTION_STOCK } from '../constants';
import cross_icon from '../icons/cross.png';
import { service } from '../service';
import Item from './item';
import './styles.css';

const sum = list => {
  const arr = Object.values(list);
  let total_price = 0;

  arr.forEach( item => total_price += item.count * item.price);
  
  return total_price;
};

const itemsReducer = (state, action) => {
  const { type, payload } = action;

  switch(type){
    case ACTION_ITEM.CHANGE:
      return {...state, [`item_${payload.id}`]: payload};
    case ACTION_ITEM.REMOVE:
      const { [`item_${payload.id}`]: removedItem, ...rest } = state;
      return rest;
    default:
      return state;
  }
}

const initialState = {};

const Dialog = ({ stock, user, dispatchStock, dispatchUser, closeDialog, showAlert }) => {
  const [is_loading, setIsLoading] = React.useState(false);
  const [selectedItems, dispatchSelectedItems] = React.useReducer(itemsReducer, initialState);
  const total_price = sum(selectedItems);
  const has_enough_gold = user.balance >= total_price;
  const is_buy_enabled = has_enough_gold && Object.values(selectedItems).length && !is_loading;

  const onBuy = () => {
    setIsLoading(true);
    service.buy()
      .then(()=> {
        dispatchUser({type: ACTION_USER.CHANGE_BALANCE, payload: user.balance - total_price});
        dispatchStock({type: ACTION_STOCK.CHANGE, payload: Object.values(selectedItems)});
        closeDialog();
      })
      .catch(()=> {
        showAlert('Request failed, please try again later');
        setIsLoading(false);
      })
  }

  return (
    <div className='dialog-bg'>
      <div className='dialog'>
        <div className='dialog__header'>
          <h3>Order</h3>
          <button className='dialog__close' onClick={closeDialog}><img src={cross_icon} alt='Close icon'/></button>
        </div>
        <div className='dialog__content'>
          <div>
            {stock.map( (item) => 
              <Item 
                key={item.id} 
                data={item} 
                dispatchSelectedItems={dispatchSelectedItems}
                selectedItems={selectedItems}
                is_loading={is_loading}
                showAlert={showAlert} />
            )}
          </div>
          <div className='dialog__total'>
            {!has_enough_gold && <div className='dialog__error'>Not enough gold in your account!</div>}
            <span>Total</span>
            <span>{total_price} gold</span>
          </div>
        </div>
        <div className='dialog__footer'>
          <button 
            className={cn('button button--primary', {
              'button--disabled': !is_buy_enabled
            })} 
            disabled={!is_buy_enabled}
            onClick={onBuy}
          >Buy</button>
          <button className='button' onClick={closeDialog}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

Dialog.propTypes = {
  stock: PropTypes.arrayOf(PropTypes.shape({
    id : PropTypes.number.isRequired,
		name : PropTypes.string.isRequired,
		price : PropTypes.number.isRequired,
		quantity : PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  })),
  user: PropTypes.shape({
    id : PropTypes.number.isRequired,
    login : PropTypes.string.isRequired,
    balance : PropTypes.number.isRequired
  }),
  dispatchStock: PropTypes.func,
  dispatchUser: PropTypes.func,
  closeDialog: PropTypes.func,
  showAlert: PropTypes.func
};

export default Dialog;