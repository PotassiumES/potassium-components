import el from 'potassium-es/src/El'
import graph from 'potassium-es/src/Graph'

import Component from 'potassium-es/src/Component'

/**
SelectionComponent offers the user a set of choices for single or multiple selection.
*/
const SelectionComponent = class extends Component {
	/**
	@param {Object} [options]
	@param {string[] | Array<{name {string}, value {string}}>} [options.items]
	*/
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					items: [],
					flatEl: el.select(),
					portalEl: el.select()
				},
				options
			)
		)
		this.addClass('selection-component')

		// Normalize the items to all be [name, value]
		this.options.items = this.options.items.map(item => {
			if (typeof item === 'string') return [item, item]
			return item
		})

		this.options.items.forEach(item => {
			this.flatEl.appendChild(el.option({ value: item[1] }, item[0]))
			this.portalEl.appendChild(el.option({ value: item[1] }, item[0]))
			/** @todo add portal and immersive spatial controls */
		})
	}

	get selectedIndex() {
		return this.flatEl.selectedIndex
	}

	set selectedIndex(index) {
		if (index >= this.flatEl.children.length) {
			console.error('No such index', index)
			return
		}
		this.flatEl.selectedIndex = index
		this.portalEl.selectedIndex = index
	}
}

export default SelectionComponent
