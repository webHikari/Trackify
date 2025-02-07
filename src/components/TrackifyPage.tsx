import React from "react";
import { createCtx, atom } from "@reatom/core";
import { reatomContext, reatomComponent, useAtom } from "@reatom/npm-react";
import Dashboard from "./partials/Dashboard";

const counterAtom = atom(0, "counter");

const Counter = reatomComponent(({ ctx }) => {
	const [count, setCount] = useAtom(counterAtom);

	return (
		<div>
			<p>{String(count)}</p>
			<button onClick={() => setCount((prev) => prev + 1)}>+</button>
			<button onClick={() => setCount((prev) => prev - 1)}>-</button>
		</div>
	);
});

const ctx = createCtx();

const TrackifyPage = () => (
	<reatomContext.Provider value={ctx}>
		<Counter />
		<Dashboard />
	</reatomContext.Provider>
);

export default TrackifyPage;
