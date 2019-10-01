import React from "react";

const Rank = ({entryCount,name}) =>{
	const entries = "#" + {entryCount}
	return(
		<div>
			<div className= "whote f3">
			{name + ", your current entry count is..."}
			</div>
			<div className="white f1">
			{entryCount}
			</div>
		</div>
	);
}

export default Rank;