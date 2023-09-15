import {range} from '@core/utils'
import {colsCount, rowsCount} from '@/components/table/table.template'

export function shouldResize(event) {
	return event.target.dataset.resize
}

export function shouldBeCell(event) {
	return event.target.dataset.type === 'cell'
}

export function matrix(current, target) {
	const rows = range(current.row, target.row)
	const cols = range(current.col, target.col)

	return cols.reduce((acc, col) => {
		rows.forEach(row => acc.push(`${row}-${col}`))
		return acc
	}, [])
}

export function nextSelector(key, col, row) {
	const MIN_VALUE = 0
	switch (key) {
		case 'Enter':
		case 'ArrowDown' : {
			row = row+1 > rowsCount-1 ? rowsCount-1 : row+1
			break
		}
		case 'Tab':
		case 'ArrowRight': {
			col = col+1 > colsCount-1 ? colsCount-1 : col+1
			break
		}
		case 'ArrowLeft': {
			col = col-1 < MIN_VALUE ? MIN_VALUE : col-1
			break
		}
		case 'ArrowUp': {
			row = row-1 < MIN_VALUE ? MIN_VALUE : row-1
			break
		}
	}
	return `[data-id="${row}-${col}"]`
}