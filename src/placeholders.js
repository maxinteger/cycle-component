import Rx from 'rx';
import {div, input, label, textarea} from '@cycle/dom';

export const textPlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        const value$ = DOM.select('.form-control')
            .events('input')
            .map(ev => ({name, value: ev.target.value}))
            .startWith({name, value});

        return {
            DOM: Rx.Observable.combineLatest(
                value$,
                ({value}) =>
                    div('.form-group', [
                        label([descriptor.label]),
                        input('.form-control', {value})
                    ])
            ),
            value$
        };
    };
    fn.id = name;
    return fn;
};

export const datePlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        const value$ = DOM.select('.form-control')
            .events('input')
            .map(ev => ({name, value: ev.target.value}))
            .startWith({name, value});

        return {
            DOM: Rx.Observable.combineLatest(
                value$,
                ({value}) =>
                    div('.form-group', [
                        label([descriptor.label]),
                        input('.form-control', {type:'date', value})
                    ])
            ),
            value$
        };
    };
    fn.id = name;
    return fn;
};

export const textareaPlaceholder = (name, descriptor) => {
    const fn = (value) => ({DOM}) => {
        const value$ = DOM.select('.form-control')
            .events('input')
            .map(ev => ({name, value: ev.target.value}))
            .startWith({name, value});

        return {
            DOM: Rx.Observable.combineLatest(
                value$,
                ({value}) =>
                    div('.form-group', [
                        label([descriptor.label]),
                        textarea('.form-control', {value})
                    ])
            ),
            value$
        };
    };
    fn.id = name;
    return fn;
};
