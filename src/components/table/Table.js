import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {tableResizeHandler} from '@/components/table/table.resize'
import {matrix, nextSelector, shouldBeCell, shouldResize} from '@/components/table/table.functions'
import {TableSelection} from '@/components/table/TableSelection'
import {$} from '@core/dom'
import * as actions from '@/redux/actions'
import {defaultStyles} from '@/constants'
import {parse} from '@core/parse'

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
		return createTable(15, this.store.getState())
	}

	prepare() {
		this.selection = new TableSelection()
	}

	init() {
		super.init()


		const $cell = this.$root.find('[data-id="0-0"]')
		this.selectCell($cell)

		this.$on('formula:input', text => {
			this.selection.current
				.attr('data-value', text)
				.text(parse(text))
			this.updateTextInStore(text)
		})

		this.$on('formula:done', () => {
			this.selection.current.focus()
		})

		this.$on('toolbar:applyStyle', value => {
			this.selection.applyStyle(value)
			this.$dispatch(actions.applyStyle({
				value,
				ids: this.selection.selectedIds
			}))
		})
	}

	selectCell($cell) {
		this.selection.select($cell)
		this.$emit('table:select', $cell)
		const styles = $cell.getStyles(Object.keys(defaultStyles))
		this.$dispatch(actions.changeStyles(styles))
	}

	async resizeTable(event) {
		try {
			const data = await tableResizeHandler(event, this.$root)
			this.$dispatch(actions.tableResize(data))

		} catch (e) {
			console.warn('Resize error; ', e.message)
		}
	}

	onMousedown(event) {
		if (shouldResize(event)) {
			this.resizeTable(event)
		} else if (shouldBeCell(event)) {
			const $target = $(event.target)
			if (event.shiftKey) {
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

	updateTextInStore(text) {
		this.$dispatch(actions.changeText({
			id: this.selection.current.id(),
			value: text
		}))
	}

	onInput(event) {
		// this.$emit('table:input', $(event.target))
		this.updateTextInStore($(event.target).text())
	}
}
