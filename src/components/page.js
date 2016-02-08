import {div} from '@cycle/dom';
import {component} from "../cms";

export default component({
    type: 'page',
    revision: 0,
    tags: ['common']
}, ({DOM, CMS, children}) => {

    return {
        DOM: div([
            div(
                children.map((id) => CMS.getComponent(id).map((c) => c({DOM, CMS}).DOM))
            )
        ])
    }
});
