import React from 'react';
import './styles.css';

const Alert = ({message, closeAlert}) => (
  <div className='alert-bg'>
    <div className='alert'>
      <p>{message}</p>
      <button className='button button--primary' onClick={closeAlert}>OK</button>
    </div>
  </div>
);

export default Alert;