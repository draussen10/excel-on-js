class Dom {
	constructor(selector) {
		this.$el = typeof selector === 'string'
			? document.querySelector(selector)
			: selector
	}

	get data() {
		return this.$el.dataset
	}

	html(html) {
		if (typeof html === 'string') {
			this.$el.innerHTML = html
			return this
		}
		return this.$el.innerHTML.trim()
	}

	clear() {
		this.html('')
		return this
	}

	closest(selector) {
		return $(this.$el.closest(selector))
	}

	getCoords() {
		return this.$el.getBoundingClientRect()
	}

	findAll(selector) {
		return this.$el.querySelectorAll(selector)
	}

	on(eventType, callback) {
		this.$el.addEventListener(eventType, callback)
	}

	out(eventType, callback) {
		this.$el.removeEventListener(eventType, callback)
	}

	css(styles = {}) {
		Object.keys(styles).forEach(key => {
			this.$el.style[key] = `${styles[key]}`
		})
	}

	append(node) {
		if (node instanceof Dom) {
			node = node.$el
		}
		if (Element.prototype.append) {
			this.$el.append(node)
		} else {
			this.$el.appendChild(node)
		}
		return this
	}
}


export function $(selector) {
	return new Dom(selector) // Нормально ли то, что каждый раз будет создаваться инстанс класса?
}

$.create = (tagName, classes = '') => {
	const el = document.createElement(tagName)
	if (classes) {
		el.classList.add(classes)
	}
	return $(el)
}