import React from 'react';
import cn from 'class-names';
import { ACTION_ITEM, ACTION_USER, ACTION_STOCK } from '../constants';
import cross_icon from '../icons/cross.png';
import minus_icon from '../icons/minus.png';
import plus_icon from '../icons/plus.png';
import { service } from '../service';
import './styles.css';



const Item = ({data, dispatchSelectedItems, showAlert, is_loading}) => {
  const [count, setCount] = React.useState(0);

  const remove = () => {
    if(is_loading) return;

    if(count-1 >= 0) {
      setCount( count => count-1);
    }
  };

  const add = () => {
    if(is_loading) return;

    if(!data.quantity) {
      showAlert('Item is no longer available');
    }else if(count+1 <= data.quantity) {
      setCount( count => count+1);
    }
  };

  const onChange = (e) => {
    if(is_loading) return;

    const value = e.target.value;
    if (!value) {
      setCount(0);
    }
    if( /^\d+$/.test(value) && value <= data.quantity && value > 0) {
      const num = Number(value);
      setCount(num);
    }
  };

  React.useEffect(() => {
    if(count) {
      dispatchSelectedItems({type: ACTION_ITEM.CHANGE, payload: {...data, count}});
    } else {
      dispatchSelectedItems({type: ACTION_ITEM.REMOVE, payload: data});
    }
  }, [count]);

  return (
    <div className='dialog-item'>
      <div className='dialog-item__title'>
        <div><img className='dialog-item__img' src={data.image} alt={data.name} /></div>
        <div className='dialog-item__name'><span>{data.name}</span></div>
      </div>
      <div className='dialog-item__actions'>
        <div className='dialog-item__counter'>
          <button onClick={remove}><img src={minus_icon} alt='Minus'/></button>
          <input type='text' value={count > 0 ? count : ''} onChange={onChange}/>
          <button onClick={add}><img src={plus_icon} alt='Plus'/></button>
        </div>
        <div className='dialog-item__total'>{data.price} gold</div>
      </div>
    </div>
  );
};

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
}

export default Dialog;