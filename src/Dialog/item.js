import React from 'react';
import PropTypes from 'prop-types';
import { ACTION_ITEM } from '../constants';
import minus_icon from '../icons/minus.png';
import plus_icon from '../icons/plus.png';
import './styles.css';



const Item = ({data, dispatchSelectedItems, selectedItems, showAlert, is_loading}) => {
  const count = selectedItems[`item_${data.id}`]?.count;

  const changeItemCount = num => {
    if(num) {
      dispatchSelectedItems({type: ACTION_ITEM.CHANGE, payload: {...data, count: num}});
    } else {
      dispatchSelectedItems({type: ACTION_ITEM.REMOVE, payload: data});
    }
  }

  const remove = () => {
    if(is_loading || !count) return;

    if(count-1 >= 0) {
      changeItemCount(count-1);
    }
  };

  const add = () => {
    if(is_loading) return;

    if(!data.quantity) {
      showAlert('Item is no longer available');
    } else if(!count) {
      changeItemCount(1);
    } else if(count+1 <= data.quantity) {
      changeItemCount(count+1);
    }
  };

  const onChange = (e) => {
    if(is_loading) return;

    const value = e.target.value;
    if (!value) {
      changeItemCount(0);
    }
    if( /^\d+$/.test(value) && value <= data.quantity && value > 0) {
      const num = Number(value);
      changeItemCount(num);
    }
  };

  return (
    <div className='dialog-item'>
      <div className='dialog-item__title'>
        <div><img className='dialog-item__img' src={data.image} alt={data.name} /></div>
        <div className='dialog-item__name'><span>{data.name}</span></div>
      </div>
      <div className='dialog-item__actions'>
        <div className='dialog-item__counter'>
          <button onClick={remove}><img src={minus_icon} alt='Minus'/></button>
          <input type='text' value={count && count > 0 ? count : ''} onChange={onChange}/>
          <button onClick={add}><img src={plus_icon} alt='Plus'/></button>
        </div>
        <div className='dialog-item__total'>{data.price} gold</div>
      </div>
    </div>
  );
};

Item.propTypes = {
  data: PropTypes.shape({
    id : PropTypes.number.isRequired,
		name : PropTypes.string.isRequired,
		price : PropTypes.number.isRequired,
		quantity : PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    count: PropTypes.number
  }), 
  dispatchSelectedItems: PropTypes.func, 
  showAlert: PropTypes.func, 
  is_loading: PropTypes.bool
};

export default Item;