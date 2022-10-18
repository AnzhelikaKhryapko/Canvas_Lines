const canvas = document.getElementById('canvas');
const button = document.getElementById('button');

class Line {
	constructor(start, finish) {
		this.start = start;
		this.finish = finish;
	}
}
let tics = 0;
let clicks = 0;
let lastClick = [0, 0];
let point = [];
let d = [];
let lines = [];
let points = [];
let context = canvas.getContext('2d');
canvas.height = 900;
canvas.width = 1000;
canvas.addEventListener('contextmenu', (event) => {
	event.preventDefault();
	if (clicks === 1) {
		lines.pop();
		lastClick = [];
		clicks = 0;
	}
});
canvas.addEventListener('click', drawLine, false);
canvas.addEventListener(
	'mousemove',
	(event) => {
		context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < lines.length; i++) {
			if (!lines[i].finish) break;
			context.beginPath();
			context.moveTo(lines[i].start[0], lines[i].start[1]);
			context.lineTo(lines[i].finish[0], lines[i].finish[1]);
			context.strokeStyle = '#000000';
			context.stroke();
		}
		context.fillStyle = '#ff3737';
		for (let i = 0; i < points.length; i++) {
			context.moveTo(points[i][0], points[i][1]);
			context.arc(points[i][0], points[i][1], 5, 0, 2 * Math.PI, false);
			context.fill();
		}

		if (clicks == 1) {
			context.beginPath();
			context.moveTo(lastClick[0], lastClick[1]);
			context.strokeStyle = '#000000';

			context.lineTo(event.offsetX, event.offsetY, 6);
			context.stroke();
			if (lines.length > 0 && lines[0].finish) {
				const innerPoints = [];
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].start && lines[i].finish) {
						let intersec = cross(
							lines[i].start[0],
							lines[i].start[1],
							lines[i].finish[0],
							lines[i].finish[1],
							lastClick[0],
							lastClick[1],
							event.offsetX,
							event.offsetY
						);
						if (intersec != 0) {
							innerPoints.push(intersec);
							point = innerPoints;
							context.fillStyle = '#ff3737';
							context.moveTo(...intersec);
							context.arc(...intersec, 5, 0, 2 * Math.PI, false);
							context.fill();
							context.fillStyle = 'black';
						}
					}
				}
			}
		} else {
		}
	},
	false
);

function getCursorPosition(e) {
	var x;
	var y;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	} else {
		x =
			e.clientX +
			document.body.scrollLeft +
			document.documentElement.scrollLeft;
		y =
			e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	return [x, y];
}

function drawLine(e) {
	console.log(lines);

	context = this.getContext('2d');
	x = e.offsetX;
	y = e.offsetY;
	if (clicks != 1) {
		lines.push(new Line([x, y]));
		clicks++;
	} else {
		lines[lines.length - 1].finish = [x, y];
		if (point.length > 0) {
			points.push(...point);
		}
		d.push([
			Math.abs(
				lines[lines.length - 1].start[0] - lines[lines.length - 1].finish[0]
			) / 100,
			Math.abs(
				lines[lines.length - 1].start[1] - lines[lines.length - 1].finish[1]
			) / 100,
		]);
		context.beginPath();
		context.moveTo(lastClick[0], lastClick[1]);
		context.lineTo(x, y, 6);
		context.strokeStyle = '#000000';
		context.stroke();

		clicks = 0;
	}
	lastClick = [x, y];
}

function cross(x1, y1, x2, y2, x3, y3, x4, y4) {
	let n;
	if (y2 - y1 != 0) {
		let q = (x2 - x1) / (y1 - y2);
		let sn = x3 - x4 + (y3 - y4) * q;
		if (!sn) {
			return 0;
		}
		let fn = x3 - x1 + (y3 - y1) * q;
		n = fn / sn;
	} else {
		if (!(y3 - y4)) {
			return 0;
		}
		n = (y3 - y1) / (y3 - y4);
	}
	let x = Math.round(x3 + (x4 - x3) * n);
	let y = Math.round(y3 + (y4 - y3) * n); // координаті точки пересечения

	if (
		Math.floor(
			Math.floor(distance(x1, y1, x2, y2)) -
				(distance(x1, y1, x, y) + distance(x2, y2, x, y))
		) < 3 &&
		Math.floor(
			Math.floor(distance(x1, y1, x2, y2)) -
				(distance(x1, y1, x, y) + distance(x2, y2, x, y))
		) > -3 &&
		Math.floor(distance(x3, y3, x4, y4)) -
			Math.floor(distance(x3, y3, x, y) + distance(x4, y4, x, y)) <
			3 &&
		Math.floor(distance(x3, y3, x4, y4)) -
			Math.floor(distance(x3, y3, x, y) + distance(x4, y4, x, y)) >
			-3
	) {
		return [x, y];
	} // принадлежит ли точка отрезкам
	return 0;
}

function distance(x1, y1, x2, y2) {
	const d1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	return +d1.toFixed(1);
}

button.addEventListener('click', () => {
	const interval = setInterval(() => {
		if (tics === 50) {
			clearInterval(interval);
			tics = 0;
			clicks = 0;
			lastClick = [0, 0];
			point = [];
			d = [];
			lines = [];
			points = [];
		}
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < lines.length; i++) {
			if (!lines[i].finish) break;
			context.beginPath();
			context.moveTo(lines[i].start[0], lines[i].start[1]);
			context.lineTo(lines[i].finish[0], lines[i].finish[1]);
			context.strokeStyle = '#000000';
			context.stroke();
			lines[i].start[0] > lines[i].finish[0]
				? ((lines[i].start[0] -= d[i][0]), (lines[i].finish[0] += d[i][0]))
				: ((lines[i].start[0] += d[i][0]), (lines[i].finish[0] -= d[i][0]));
			lines[i].start[1] > lines[i].finish[1]
				? ((lines[i].start[1] -= d[i][1]), (lines[i].finish[1] += d[i][1]))
				: ((lines[i].start[1] += d[i][1]), (lines[i].finish[1] -= d[i][1]));
		}
		tics++;
	}, 20);
});
