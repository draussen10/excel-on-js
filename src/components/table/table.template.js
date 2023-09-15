const CODES = {
	A: 65,
	Z: 90
}

export const rowsCount = 15
export const colsCount = CODES.Z - CODES.A + 1

function toCell(_, indexCol, indexRow) {
	return `
	<div 
		class="cell" 
		contenteditable=""
		data-col=${indexCol}
		data-type="cell"
		data-id="${indexRow}-${indexCol}"
		>
	</div>
	`
}

function toColumn(colName, index) {
	return `
		<div class="column" data-type="resizable" data-col="${index}">
			${colName}
			<div class="col-resize" data-resize="col"></div>
		</div>
	`
}

function createRow(index, content) {
	const resizer = index
		? '<div class="row-resize" data-resize="row"></div>'
		: ''

	return `
		<div class="row" data-type="resizable">
			<div class="row-info">
				${index ? index : ''}
				${resizer}
			</div>
			<div class="row-data">${content}</div>
		</div>
	`
}

function toChar(_, index) {
	return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15) {
	const rows = []

	const cols = new Array(colsCount)
		.fill('')
		.map(toChar)
		.map(toColumn)
		.join('')

	rows.push(createRow(null, cols))

	for (let indexRow = 0; indexRow < rowsCount; indexRow++) {
		const cells = new Array(colsCount)
			.fill('')
			.map((_, indexCol) => toCell(_, indexCol, indexRow))
			.join('')

		rows.push(createRow(indexRow + 1, cells))
	}

	return rows.join('')
}
