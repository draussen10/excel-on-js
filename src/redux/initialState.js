import {storage} from '@core/utils'
import {defaultStyles, defaultTitle} from '@/constants'

const defaultState = {
	rowState: {},
	colState: {},
	dataState: {},
	stylesState: {},
	currentText: '',
	title: defaultTitle,
	currentStyles: defaultStyles,
	date: new Date().toJSON()
}

const normalize = state => ({
	...state,
	currentStyles: defaultStyles,
	currentText: ''
})

export function normalizeInitialState(state) {
	return state ? normalize(state) : {...defaultState}
}