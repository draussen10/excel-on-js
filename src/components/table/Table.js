import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {$} from '@core/dom'
import {tableResizeHandler} from '@/components/table/table.resize'
import {shouldResize} from '@/components/table/table.functions'

export class Table extends ExcelComponent {
	static className = 'excel__table'

	constructor($root) {
		super($root, {
			name: 'Table',
			listeners: ['mousedown']
		})
	}

	toHTML() {
		return createTable()
	}

	onMousedown(event) {
		if (shouldResize(event)) {
			tableResizeHandler(event, this.$root)
		}
	}
}
