import dom from 'potassium-es/src/DOM'
import som from 'potassium-es/src/SOM'
import Component from 'potassium-es/src/Component'
import { lt, ld } from 'potassium-es/src/Localizer'
import DataObject from 'potassium-es/src/DataObject'
import DataCollection from 'potassium-es/src/DataCollection'

/**
DefaultItemComponent is used by CollectionComponent if no itemComponent option is passed
*/
const DefaultItemComponent = class extends Component {
	constructor(dataObject = null, options = {}) {
		super(dataObject, Object.assign({ flatDOM: dom.li() }, options))
		if (dataObject instanceof DataObject === false) throw 'DefaultItemComponent requires a dataObject'
		this.addClass('default-item-component')
		this.setName('DefaultItemComponent')

		this._labelComponent = new LabelComponent(null, {
			text: lt('Item: ') + new String(dataObject)
		}).appendTo(this)
	}
}

/**
CollectionComponent provides a generic list UI for DataCollections.

@param {DataObject} [dataObject=null]
@param {Object} [options={}]
@param {Component} [options.itemComponent=DefaultItemComponent] a Component class used to render each item in this list
@param {Object} [options.itemOptions] a set of options to pass to each item Component
@param {function} [options.onClick] a function to call with the dataObject whose item Component is clicked
*/
const CollectionComponent = class extends Component {
	constructor(dataObject = null, options = {}) {
		super(
			dataObject,
			Object.assign(
				{
					flatDOM: dom.ul(),
					portalDOM: dom.ul()
				},
				options
			)
		)
		this.addClass('collection-component')
		this.setName('CollectionComponent')

		if (dataObject instanceof DataCollection === false) throw 'CollectionComponent requires a DataCollection dataObject'
		this._inGroupChange = false // True while resetting or other group change
		this._dataObjectComponents = new Map() // dataObject.id -> Component

		this.dataObject.addListener((...params) => {
			this._handleCollectionReset(...params)
		}, 'reset')
		this.dataObject.addListener((...params) => {
			this._handleCollectionAdded(...params)
		}, 'added')
		if (this.dataObject.isNew === false) {
			this._handleCollectionReset()
		}
	}
	at(index) {
		// Returns the Component at index, or null if index is out of bounds
		if (index < 0) return null
		if (index >= this.flatDOM.children.length) return null
		return this.flatDOM.children.item(index).component
	}
	componentForDataObject(dataObject) {
		return this._dataObjectComponents.get(dataObject.get('id'))
	}
	filter(filterFn = null) {
		// filterFn must accept a DataModel and return a boolean indicating whether its Component.flatDOM.style.display should be set to '' or 'none'
		for (const [i, itemComponent] of this._dataObjectComponents) {
			let display
			if (typeof filterFn === 'function') {
				display = filterFn(itemComponent.dataObject)
			} else {
				display = true
			}
			if (display) {
				itemComponent.show()
			} else {
				itemComponent.hide()
			}
		}
	}
	_handleCollectionAdded(eventName, collection, dataObject) {
		this._add(this._createItemComponent(dataObject))
	}
	_handleCollectionRemoved(eventName, collection, dataObject) {
		const component = this.componentForDataObject(dataObject)
		if (component) {
			this._remove(component)
		}
	}
	_handleCollectionReset(eventName, target) {
		if (target !== this.dataObject) return // It was a reset for an item in the collection, not the collection itself
		this._inGroupChange = true
		this.trigger(CollectionComponent.Resetting, this)
		for (const [_, itemComponent] of this._dataObjectComponents) {
			this._remove(itemComponent)
		}
		this._dataObjectComponents.clear()
		for (const dataObject of this.dataObject) {
			this._add(this._createItemComponent(dataObject))
		}
		this._inGroupChange = false
		this.trigger(CollectionComponent.Reset, this)
	}
	_handleItemClick(ev, itemComponent) {
		if (this.options.onClick) {
			ev.preventDefault()
			this.options.onClick(itemComponent.dataObject)
		}
	}
	_add(itemComponent) {
		/** @todo this assumes the PK is called 'id' and  it shouldn't */
		if (this._dataObjectComponents.get(itemComponent.dataObject.get('id'))) {
			// Already have it, ignore the add
			return
		}
		this._dataObjectComponents.set(itemComponent.dataObject.get('id'), itemComponent)

		this.appendComponent(itemComponent)
		/** @todo switch to action-input */
		if (this.options.onClick) {
			itemComponent.flatDOM.addEventListener('click', ev => {
				this._handleItemClick(ev, itemComponent)
			})
		}

		itemComponent.dataObject.addListener(this._handleDeleted.bind(this), 'deleted', true)
	}
	_remove(itemComponent) {
		this._dataObjectComponents.delete(itemComponent.dataObject.get('id'))
		this.removeComponent(itemComponent)
		itemComponent.flatDOM.removeEventListener('click', null)
		itemComponent.portalDOM.removeEventListener('click', null)
		itemComponent.cleanup()
	}
	_handleDeleted(eventName, dataObject, error) {
		if (error) return
		const component = this._dataObjectComponents.get(dataObject.get('id'))
		if (component) {
			this._remove(component)
		}
	}
	_createItemComponent(itemDataObject) {
		let options
		if (this.options.itemOptions) {
			options = Object.assign({}, this.options.itemOptions)
		} else {
			options = {}
		}
		let itemComponent
		if (this.options.itemComponent) {
			itemComponent = new this.options.itemComponent(itemDataObject, options)
		} else {
			itemComponent = new DefaultItemComponent(itemDataObject, options)
		}
		itemComponent.addClass('collection-item')
		return itemComponent
	}
}
CollectionComponent.Resetting = 'collection-component-resetting'
CollectionComponent.Reset = 'collection-component-reset'

export default CollectionComponent
