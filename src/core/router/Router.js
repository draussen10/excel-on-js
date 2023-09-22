import {$} from '@core/dom'
import {ActiveRoute} from '@core/router/ActiveRoute'

export class Router {
	constructor(selector, routes) {
		if (!selector) {
			throw new Error('Selector is not provided in Router')
		}

		this.changePageHandler = this.changePageHandler.bind(this)

		this.$placeholder = $(selector)
		this.routes = routes

		this.page = null

		this.init()
	}

	init() {
		window.addEventListener('hashchange', this.changePageHandler)
		this.changePageHandler()
	}

	changePageHandler() {
		if (this.page) {
			this.$placeholder.clear()
			this.page.destroy()
		}

		const Page = ActiveRoute.path.includes('excel')
			? this.routes.excel
			: this.routes.dashboard

		this.page = new Page(ActiveRoute.param)

		this.$placeholder.append(this.page.getRoot())
		this.page.afterRender()
	}

	destroy() {
		window.removeEventListener('hashchange', this.changePageHandler)
	}
}
