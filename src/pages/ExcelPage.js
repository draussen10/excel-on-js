import {Page} from '@core/Page'
import {Header} from '@/components/header/Header'
import {Excel} from '@/components/excel/Excel'
import {createStore} from '@core/createStore'
import {rootReducer} from '@/redux/rootReducer'
import {normalizeInitialState} from '@/redux/initialState'
import {Table} from '@/components/table/Table'
import {Formula} from '@/components/formula/Formula'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {debounce, storage} from '@core/utils'
import {ActiveRoute} from '@core/router/ActiveRoute'

function storageName(param) {
	return 'excel:' + param
}

export class ExcelPage extends Page {
	getRoot() {
		let params
		if (!this.params) {
			const now = Date.now().toString()
			ActiveRoute.navigate(`excel:${now}`)
			params = now
		} else {
			params = this.params
		}

		const state = storage(storageName(params))
		const store = createStore(rootReducer, normalizeInitialState(state))

		const stateListener = debounce(state => {
			storage(storageName(params), state)
		}, 300)

		store.subscribe(stateListener)

		this.excel = new Excel({
			components: [Header, Toolbar, Formula, Table],
			store
		})

		return this.excel.getRoot()
	}

	afterRender() {
		this.excel.init()
	}

	destroy() {
		this.excel.destroy()
	}
}
