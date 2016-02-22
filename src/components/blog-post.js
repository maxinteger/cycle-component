import {h2, p, div} from '@cycle/dom';
import {component} from '../cms';
import {textPlaceholder, datePlaceholder, textareaPlaceholder} from '../placeholders';

export default component({
    type: 'blog-post',
    revision: 0,
    tags: ['common'],
    placeholders: [
        textPlaceholder('title', {label: 'Title'}),
        textPlaceholder('author', {label: 'Author'}),
        datePlaceholder('created', {label: 'Created'}),
        textareaPlaceholder('body', {label: 'Body'})
    ]
}, ({DOM, CMS, children, placeholders}) => {
    return {
        DOM: div('.container',
            div('.blog-post', [
                h2('blog-post-title', placeholders.title),
                p('.blog-post-meta', `${placeholders.created} - ${placeholders.author}`),
                div('.blog-body', placeholders.body)
            ])
        )
    }
});