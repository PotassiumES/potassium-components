import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'

import Component from 'potassium-es/src/Component'

import LabelComponent from 'potassium-components/src/atoms/LabelComponent'
import ToggleComponent from 'potassium-components/src/atoms/ToggleComponent'

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
		this.options.items = this.options.items.map((item) => {
			if (typeof item === 'string') return [item, item]
			return item
		})

		if (this.usesSOM) {
			const labelComponent = new LabelComponent(
				undefined,
				{
					usesFlat: false,
					usesPortalOverlay: false
				},
				this.inheritedOptions
			)
			const toggleComponent = new ToggleComponent(
				undefined,
				{
					usesFlat: false,
					usesPortalOverlay: false
				},
				this.inheritedOptions
			)
			this._spatialDisplay = new Component(
				undefined,
				{
					usesFlat: false,
					usesPortalOverlay: false,
					labelComponent: labelComponent,
					toggleComponent: toggleComponent
				},
				this.inheritedOptions
			).appendTo(this)
			this._spatialDisplay.addClass('selection-display')
			this._spatialDisplay.setName('SelectionDisplay')
			this._spatialDisplay.appendComponent(labelComponent)
			this._spatialDisplay.appendComponent(toggleComponent)

			this.listenTo(
				Component.ActionEvent,
				this._spatialDisplay,
				(eventName, actionName, active, value, actionParameters) => {
					if (actionName === '/action/activate' && active) {
						this._spatialDisplay.hide()
						this._spatialList.show()
					}
				}
			)

			this._spatialList = new Component(
				undefined,
				{
					usesFlat: false,
					usesPortalOverlay: false
				},
				this.inheritedOptions
			)
				.appendTo(this)
				.hide()
			this._spatialList.addClass('selection-list')
			this._spatialList.setName('SelectionList')
		}

		this.options.items.forEach((item, index) => {
			this.flatDOM.appendChild(dom.option({ value: item[1] }, item[0]))
			this.portalDOM.appendChild(dom.option({ value: item[1] }, item[0]))

			if (this.usesSOM) {
				const itemComponent = new SelectionItemComponent(
					undefined,
					{
						index: index,
						text: item[0],
						value: item[1]
					},
					this._spatialList.inheritedOptions
				).appendTo(this._spatialList)
				this.listenTo(
					Component.ActionEvent,
					itemComponent,
					(eventName, actionName, active, value, actionParameters) => {
						if (actionName === '/action/activate' && active) {
							this.selectedIndex = itemComponent.options.index
							this._spatialDisplay.show()
							this._spatialList.hide()
						}
					}
				)
			}
		})

		if (this.usesSOM) {
			this._updateSpatialSelection()
		}

		this.listenTo('input', this.flatDOM, (ev) => {
			this.selectedIndex = this.flatDOM.selectedIndex
		})
		this.listenTo('input', this.portalDOM, (ev) => {
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

		if (changed) {
			this._updateSpatialSelection()
			this.trigger(SelectionComponent.SELECTION_INDEX_CHANGED, this.flatDOM.selectedIndex)
		}
	}

	_updateSpatialSelection() {
		if (this.usesSOM === false) return
		const option = this.options.items[this.selectedIndex]
		this._spatialDisplay.options.labelComponent.text = option[0]
	}
}

class SelectionItemComponent extends LabelComponent {
	constructor(dataObject = null, options = {}, inheritedOptions = {}) {
		super(dataObject, options, inheritedOptions)
		this.addClass('selection-item')
	}
}

SelectionComponent.SELECTION_INDEX_CHANGED = 'selection-index-changed'

export default SelectionComponent
