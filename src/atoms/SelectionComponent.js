import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

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
					flatDOM: dom.select(),
					portalDOM: dom.select()
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
			this.flatDOM.appendChild(dom.option({ value: item[1] }, item[0]))
			this.portalDOM.appendChild(dom.option({ value: item[1] }, item[0]))
			/** @todo add portal and immersive spatial controls */
		})
	}

	get selectedIndex() {
		return this.flatDOM.selectedIndex
	}

	set selectedIndex(index) {
		if (index >= this.flatDOM.children.length) {
			console.error('No such index', index)
			return
		}
		this.flatDOM.selectedIndex = index
		this.portalDOM.selectedIndex = index
	}
}

export default SelectionComponent
