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
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(
			dataObject,
			Object.assign(
				{
					items: [],
					flatDOM: dom.select(),
					portalDOM: dom.select()
				},
				options
			),
			inheritedOptions
		)
		this.addClass('selection-component')
		this.setName('SelectionComponent')

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

		this.listenTo('input', this.flatDOM, ev => {
			this.selectedIndex = this.flatDOM.selectedIndex
		})
		this.listenTo('input', this.portalDOM, ev => {
			this.selectedIndex = this.portalDOM.selectedIndex
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
		let changed = false
		if (this.flatDOM.selectedIndex !== index) {
			changed = true
			this.flatDOM.selectedIndex = index
		}
		if (this.portalDOM.selectedIndex !== index) {
			changed = true
			this.portalDOM.selectedIndex = index
		}
		/** @todo update the SOMs */
		if (changed) {
			this.trigger(SelectionComponent.SELECTION_INDEX_CHANGED, this.flatDOM.selectedIndex)
		}
	}
}

SelectionComponent.SELECTION_INDEX_CHANGED = 'selection-index-changed'

export default SelectionComponent
