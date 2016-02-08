import Rx from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, h1, div, h, input} from '@cycle/dom';
import {makeHistoryDriver} from '@cycle/history';
import {makeCMDDriver, component, textPlaceholder} from './cms';


component({
    type: 'page',
    revision: 0,
    tags: ['common']
}, ({DOM, CMS, children}) => {

    return {
        DOM: div([
                h1('Page'),
                div(
                    children.map( (id) => CMS.getComponent(id).map( (c) => c({DOM, CMS}).DOM ) )
                )
            ])
    }
});


component({
    type: 'title',
    revision: 0,
    tags: ['common'],
    placeholders: [
        textPlaceholder('title')
    ]
}, ({DOM, CMS, placeholders}) => {
    return {
        DOM: h1(placeholders.title)
    }
});

component({
    type: 'img-text',
    revision: 0,
    tags: ['common']
}, ({DOM, CMS, children}) => {
    return {
        DOM: h1('Image txt')
    }
});


function main({DOM, History, CMS}) {
    return {
        DOM:
            Rx.Observable.combineLatest(
                CMS.getComponent('A'),
                CMS.getPlaceholders('B'),
                (component, placeholders) =>
                    div([
                        div(placeholders.map( (ph) => ph({DOM}).DOM )),
                        h('hr'),
                        div(component({DOM, CMS}).DOM )
                    ])
            )
    };
}

const drivers = {
    DOM: makeDOMDriver('#app'),
    History: makeHistoryDriver({
        hash: false,
        queries: true,
        basename: '/'
    }),
    CMS: makeCMDDriver({
        site: {
            title: 'CMS',
            theme: 'bootstrap',
            routes: [
                {
                    page: 'A',
                    name: 'Home page',
                    path: '/',
                    visible: true
                }
            ]
        },
        components: {
            A: {
                type: 'page-rev0-common',
                id: 'A',
                children: ['B', 'C']
            },
            B: {
                type: 'title-rev0-common',
                id: 'B',
                placeholders: {
                    title: 'Hello world'
                }
            },
            C: {
                type: 'img-text-rev0-common',
                id: 'B',
                placeholders: [
                    {type: 'richtext', name: 'title', value: 'Hello world'},
                    {type: 'image', name: 'title', value: {url: '...', width:100, height: 100, top:0, left: 0}}
                ]
            }
        }
    })
};


Cycle.run(main, drivers);