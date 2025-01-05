export interface IMouseMove {
	x: number;
	y: number;
	timestamp: number;
}

export interface IScroll {
	y: number;
	timestamp: number;
}

export interface IClick {
	x: number;
	y: number;
	element: EventTarget | null;
	timestamp: number;
}

export interface ITimeOnPage {
	userId: string,
	url: string,
	startTime: number,
	endTime: number
}
