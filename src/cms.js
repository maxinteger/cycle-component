import _ from 'lodash/fp';
import {div, input, label, textarea} from '@cycle/dom';

const Components = {
    componentRepository: {},

    /**
     * @param {string}componentId
     * @returns {function}
     */
    resolve(componentId){
        if (this.componentRepository[componentId]){
            return this.componentRepository[componentId];
        } else {
            throw new Error(`Component type: "${componentId}" is not exist`)
        }
    },

    /**
     * @param {string} componentId
     * @param {object} component
     * @param {function} component.body
     * @param {function[]} component.placeholders
     */
    add(componentId, component){
        this.componentRepository[componentId] = component;
    }
};


export const textPlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        return {
            DOM: div('.form-group', [
                label([descriptor.label]),
                input('.form-control', {value})
            ])
        };
    };
    fn.id = name;
    return fn;
};

export const datePlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        return {
            DOM: div('.form-group', [
                label([descriptor.label]),
                input('.form-control', {type: 'date', value})
            ])
        };
    };
    fn.id = name;
    return fn;
};

export const textareaPlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        return {
            DOM: div('.form-group', [
                label([descriptor.label]),
                textarea('.form-control', {type: 'date', value})
            ])
        };
    };
    fn.id = name;
    return fn;
};


/**
 *
 * @param {object}     meta
 * @param {string}     meta.type
 * @param {number}     meta.revision
 * @param {string[]}   [meta.tags]
 * @param {string}     [meta.name]
 * @param {string}     [meta.description]
 * @param {string}     [meta.author]
 * @param {function[]} [meta.placeholders]
 * @param {function}   fn
 * @returns {function}
 */
export const component = (meta, fn) => {
    const componentId = `${meta.type}-rev${meta.revision}-${_.map(_.snakeCase, meta.tags).join('-')}`;

    Components.add(componentId, {
        // {id, placeholders, children} => {DOM, CMS} =>
        body: (componentData) => (drivers) => fn(_.assign(drivers, componentData)),
        placeholders: meta.placeholders || []
    })
};



export const makeCMDDriver = (initValue) => {
    return (request$) => {
        request$.subscribe((value) => console.log(value));

        return {
            getComponentDescriptor(id) {
                return request$
                    .filter( req => req.id === id )
                    .map( req => req.value )
                    .startWith( initValue.components[id] )
            },
            getComponent (id) {
                return this.getComponentDescriptor(id)
                    .map( comp => Components.resolve(comp.type).body(comp) )
            },
            getPlaceholders(id) {
                return this.getComponentDescriptor(id)
                    .map( comp =>
                        Components.resolve(comp.type).placeholders.map( (ph) =>
                            ph(comp.placeholders[ph.id])
                        )
                    )
            },
            updatePlaceholders(id, placeholders){
                return
            }
        }
    }
};