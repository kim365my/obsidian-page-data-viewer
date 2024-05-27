import React from "react";

export default function Progress({progress}: {progress: number}) {
	return (
		<span>
			<progress value={progress} max="100"></progress>&nbsp;
			<span>{progress}%</span>
		</span>
	);
}
