import {div, h1} from '@cycle/dom';
import {component} from '../cms';
import {textPlaceholder} from '../placeholders';

export default component({
    type: 'title',
    revision: 0,
    tags: ['common'],
    placeholders: [
        textPlaceholder('title')
    ]
}, ({DOM, CMS, placeholders}) => {
    return {
        DOM: div('.container', h1('.page-header', placeholders.title))
    }
});