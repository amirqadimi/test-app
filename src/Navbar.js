import React from "react";
import cn from "class-names";

export const Navbar = ({user, setIsDialogOpen}) => {
  const [is_menu_open, setIsMenuOpen] = React.useState(false);
	const onOpenBuyDialog = (args) => {
		args.preventDefault();
		setIsDialogOpen(true);
	};

	return (
		<div className="navbar navbar-inverse navbar-fixed-top">
			<div className="container">
				<div className="navbar-header">
					<button onClick={()=> setIsMenuOpen(state => !state)} type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
				</div>
				<div className={cn("navbar-collapse", {
          "collapse": !is_menu_open
        })}>
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