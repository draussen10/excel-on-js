import {Page} from '@core/Page'
import {Header} from '@/components/header/Header'
import {Excel} from '@/components/excel/Excel'
import {createStore} from '@core/store/createStore'
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

class StateProcessor {
	constructor(saver, delay = 300) {
		this.client = saver
		this.listen = debounce(this.listen.bind(this), delay)
	}

	listen(state) {
		this.client.save(state)
	}

	get() {
		return this.client.get()
	}
}

class LocalStorageClient {
	constructor(name) {
		this.name = storageName(name)
	}

	save(state) {
		storage(this.name, state)
		return Promise.resolve()
	}

	get() {
		return Promise.resolve(storage(this.name))
	}

}

export class ExcelPage extends Page {
	constructor(param) {
		super(param)

		this.storeSub = null
		this.processor = new StateProcessor(
			new LocalStorageClient(this.params)
		)
	}

	async getRoot() {
		const state = await this.processor.get()
		const store = createStore(rootReducer, normalizeInitialState(state))

		this.storeSub = store.subscribe(this.processor.listen)

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
		this.storeSub.unsubscribe()
	}
}
