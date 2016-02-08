import Rx from 'rx';
import Cycle from '@cycle/core';
import {makeDOMDriver, h1, h2, p, div, form, h, input} from '@cycle/dom';
import {makeHistoryDriver} from '@cycle/history';
import {makeCMDDriver} from './cms';

import {} from './components/page'
import {} from './components/title'
import {} from './components/blog-post'


function main({DOM, History, CMS}) {
    return {
        DOM:
            Rx.Observable.combineLatest(
                CMS.getComponent('A'),
                CMS.getPlaceholders('C'),
                (component, placeholders) =>
                    div([
                        form('.form.container', placeholders.map( (ph) => ph({DOM}).DOM )),
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
                type: 'blog-post-rev0-common',
                id: 'B',
                placeholders: {
                    title: 'First blog post',
                    created: '2016. February 8.',
                    author: 'Bela',
                    body: '<em>hello</em>'
                }
            }
        }
    })
};


Cycle.run(main, drivers);