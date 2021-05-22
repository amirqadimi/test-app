import React, { Fragment } from "react";

export const Stock = ({stock}) => {

	return (
		<>
			<h2>Current stocks</h2>
			<div>
				{stock.map((item) => (<Fragment key={item.id}>{item.name} : {item.quantity}<br/></Fragment>))}
			</div>
		</>
	);
};