import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {tableResizeHandler} from '@/components/table/table.resize'
import {matrix, nextSelector, shouldBeCell, shouldResize} from '@/components/table/table.functions'
import {TableSelection} from '@/components/table/TableSelection'
import {$} from '@core/dom'
import {range} from '@core/utils'

export class Table extends ExcelComponent {
	static className = 'excel__table'

	constructor($root, options) {
		super($root, {
			name: 'Table',
			listeners: ['mousedown', 'keydown', 'input'],
			...options
		})
	}

	toHTML() {
		return createTable()
	}

	prepare() {
		this.selection = new TableSelection()
	}

	init() {
		super.init()


		const $cell = this.$root.find('[data-id="0-0"]')
		this.selectCell($cell)

		this.$on('formula:input', text => {
			this.selection.current.text(text)
		})

		this.$on('formula:done', () => {
			this.selection.current.focus()
		})
	}

	selectCell($cell) {
		this.selection.select($cell)
		this.$emit('table:select', $cell)
	}

	onMousedown(event) {
		if (shouldResize(event)) {
			tableResizeHandler(event, this.$root)
		} else if (shouldBeCell(event)) {
			const $target = $(event.target)
			if(event.shiftKey) {
				const target = $target.id(true)
				const current = this.selection.current.id(true)

				const $cells = matrix(target, current).map(id => this.$root.find(`[data-id="${id}"]`))
				this.selection.selectGroup($cells)
			} else {
				this.selectCell($target)
			}
		}
	}

	onKeydown(event) {
		const keys = ['Enter', 'Tab', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
		const {key} = event
		if (keys.includes(key) && !event.shiftKey) {
			event.preventDefault()
			const {col, row} = this.selection.current.id(true)
			const $next = this.$root.find(nextSelector(key, col, row))
			this.selectCell($next)
		}
	}

	onInput(event) {
		this.$emit('table:input', $(event.target))
	}
}
