import {capitalize} from '@core/utils'

export class DOMListener {
	constructor($root, listeners = []) {
		if (!$root) {
			throw new Error(`No $root provided for DOMListener`)
		}
		this.$root = $root
		this.listeners = listeners
	}

	initDOMListeners() {
		this.listeners.forEach(listener => {
			const method = getMethodName(listener)
			if (!this[method]) {
				throw Error(`Not found method ${method} in ${this.name}`)
			}
			this[method] = this[method].bind(this)
			this.$root.on(listener, this[method])
		})
	}

	removeDOMListeners() {
		this.listeners.forEach(listener => {
			const method = getMethodName(listener)
			this.$root.out(listener, this[method])
		})
	}
}

function getMethodName(eventName) {
	return 'on' + capitalize(eventName)
}
