export class TableSelection {
	static className = 'selected'

	constructor() {
		this.group = []
		this.current = null
	}

	clear() {
		this.group.forEach($el => $el.removeClass(TableSelection.className))
		this.group = []
	}

	get selectedIds() {
		return this.group.map($el => $el.id())
	}

	select($el) {
		this.clear()
		this.group.push($el)
		this.current = $el
		$el.addClass(TableSelection.className).focus()
	}
	selectGroup($cells = []) {
		this.clear()
		this.group = $cells
		this.group.forEach($cell => $cell.addClass(TableSelection.className))
	}

	applyStyle(style) {
		this.group.forEach($el => $el.css(style))
	}
}
