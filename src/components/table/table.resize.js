import {$} from '@core/dom'

export function tableResizeHandler(event, root) {
	return new Promise(resolve => {
		const $resizer = $(event.target)
		const $parent = $resizer.closest('[data-type="resizable"]')
		const coords = $parent.getCoords()
		const type = $resizer.data.resize
		const sideProp = type === 'col' ? 'bottom' : 'right'
		let value

		$resizer.css({
			opacity: 1,
			[sideProp]: '-2000px'
		})

		document.onmousemove = e => {
			if (type === 'col') {
				const delta = e.pageX - coords.right
				value = coords.width + delta
				$resizer.css({right: -delta + 'px', bottom: '-2000px'})
			} else {
				const delta = e.pageY - coords.bottom
				value = coords.height + delta
				$resizer.css({bottom: -delta + 'px', right: ''})
			}
		}

		document.onmouseup = () => {
			document.onmousemove = null
			document.onmouseup = null
			if (type === 'col') {
				$parent.css({width: value + 'px'})
				root
					.findAll(`[data-col="${$parent.data.col}"]`)
					.forEach(cell => cell.style.width = value + 'px')
			} else {
				$parent.css({height: value + 'px'})
			}

			resolve({
				type,
				value,
				// id: type === 'col' ? $parent.data.col : $parent.data.row
				id: $parent.data[type]
			})

			$resizer.css({
				right: 0,
				bottom: 0,
				opacity: 0,
			})
		}
	})
}