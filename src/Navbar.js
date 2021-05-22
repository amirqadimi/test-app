import React from "react";

export const Navbar = ({user, setIsDialogOpen}) => {

	const onOpenBuyDialog = (args) => {
		args.preventDefault();
		setIsDialogOpen(true);
	};

	return (
		<div className="navbar navbar-inverse navbar-fixed-top">
			<div className="container">
				<div className="navbar-header">
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
				</div>
				<div className="navbar-collapse collapse">
					<ul className="nav navbar-nav">
						<li><a href="/">Home</a></li>
						<li><a href="#" onClick={onOpenBuyDialog}>Buy</a></li>
					</ul>
					<span className="navbar-right navbar-text">{user?.balance} gold</span>
				</div>
			</div>
		</div>
	);
};