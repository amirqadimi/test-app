import React, { useState, useReducer, useEffect } from "react";
import { ACTION_USER, ACTION_STOCK } from './constants';
import { service } from "./service";
import { Navbar } from "./Navbar";
import { Stock } from "./Stock";
import { Footer } from "./Footer";
import Dialog from "./Dialog";

const userReducer = (state, action) => {
  const {type, payload} = action;
  switch(type){
    case ACTION_USER.ADD:
      return payload;
    case ACTION_USER.CHANGE_BALANCE:
      return {...state, balance: payload};
    default:
      return state;
  }
}

const stockReducer = (state, action) => {
  const {type, payload} = action;
  switch(type){
    case ACTION_STOCK.ADD:
      return payload;
    case ACTION_STOCK.CHANGE:
      return state.map( item => {
        let new_item = item;
        payload.forEach( changed_item => {
          if(item.id === changed_item.id 
            && item.quantity - changed_item.count >= 0
          ){
            new_item = {...item, quantity: item.quantity - changed_item.count};
          }
        });
        return new_item;
      });
    default:
      return state;
  }
}

function App() {

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [user, dispatchUser] = useReducer(userReducer, null);
	const [stock, dispatchStock] = useReducer(stockReducer, []);

	useEffect(() => {
		service.getUser()
			.then((user) => {
				dispatchUser({type: ACTION_USER.ADD, payload: user});
			})
			.then(service.list)
			.then((items) => {
				dispatchStock({type: ACTION_STOCK.ADD, payload: items});
			});
	}, []);

	return (
		<>
			<Navbar user={user} setIsDialogOpen={setIsDialogOpen}/>
			<div className="container body-content">
				<h2>Hello, {user?.login}</h2>
				<p>
					Have a nice day
				</p>
				<Stock stock={stock} />
        {isDialogOpen && 
          <Dialog stock={stock} user={user} dispatchUser={dispatchUser} dispachStock={dispatchStock} closeDialog={() => setIsDialogOpen(false)}/>}
				<Footer />
			</div>
		</>
	);
}

export default App;
