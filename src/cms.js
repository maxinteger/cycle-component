import _ from 'lodash/fp';

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
    const model = _.cloneDeep(initValue);
    return (request$) => {
        request$
            .do(console.log.bind(console))
            .doOnError(console.error.bind(console))
            .subscribe( update => _.merge(model, update) );

        return {
            getComponentDescriptor(id) {
                return request$
                    .filter( req => req.id === id )
                    .map( req => req.value )
                    .startWith( model.components[id] )
            },
            getComponent (id) {
                return this
                    .getComponentDescriptor(id)
                    .map( comp => Components.resolve(comp.type).body(comp) )
            },
            getPlaceholders(id) {
                return this
                    .getComponentDescriptor(id)
                    .map( comp =>
                        Components.resolve(comp.type).placeholders.map( (ph) =>
                            ph(comp.placeholders[ph.id])
                        )
                    )
            },
            updatePlaceholder(id, placeholder$){
                return placeholder$
                    .map( p => ({ components:{ [id]: { placeholders: {[p.name]: p.value} } }}) );
            }
        }
    }
};