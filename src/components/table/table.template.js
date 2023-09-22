import {toInlineStyles} from '@core/utils'
import {defaultStyles} from '@/constants'
import {parse} from '@core/parse'

const CODES = {
	A: 65,
	Z: 90
}

export const rowsCount = 15
export const colsCount = CODES.Z - CODES.A + 1
const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

function getWidth(state = {}, index) {
	return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(state = {}, index) {
	return (state[index] || DEFAULT_HEIGHT) + 'px'
}

function toCell(_, indexCol, indexRow, state) {
	const id = `${indexRow}-${indexCol}`
	const data = state.dataState[id]
	const styles = toInlineStyles({
		...defaultStyles,
		...state.stylesState[id]
	})

	return `
	<div 
		class="cell" 
		contenteditable=""
		data-col=${indexCol}
		data-type="cell"
		data-id="${id}"
		data-value="${data || ''}"
		style="${styles}; width: ${getWidth(state.colState, indexCol)}"
		>
		${parse(data) || ''}
	</div>
	`
}

function toColumn({col, index, width}) {

	return `
		<div class="column" data-type="resizable" data-col="${index}" style="width: ${width}">
			${col}
			<div class="col-resize" data-resize="col"></div>
		</div>
	`
}

function createRow(index, content, rowState) {
	const resizer = index
		? '<div class="row-resize" data-resize="row"></div>'
		: ''

	return `
		<div class="row" data-type="resizable" data-row="${index}" style="height: ${getHeight(rowState, index)}">
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

function withWidthFrom(state) {
	return function (col, index) {
		return {
			col, index, width: getWidth(state.colState, index)
		}
	}
}

export function createTable(rowsCount = 15, state = {}) {
	const rows = []

	const cols = new Array(colsCount)
		.fill('')
		.map(toChar)
		.map(withWidthFrom(state))
		.map(toColumn)
		.join('')

	rows.push(createRow(null, cols, {}))

	for (let indexRow = 0; indexRow < rowsCount; indexRow++) {
		const cells = new Array(colsCount)
			.fill('')
			.map((_, indexCol) => toCell(_, indexCol, indexRow, state))
			.join('')

		rows.push(createRow(indexRow + 1, cells, state.rowState))
	}

	return rows.join('')
}
