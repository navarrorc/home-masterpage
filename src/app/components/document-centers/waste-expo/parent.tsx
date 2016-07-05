import * as React from 'react';
import { Results } from './results';

/***
 * Parent Component (stateless)
 */
export const Parent = (props)=> {
        let totalItems = props.totalItems;
        let ready = props.ready;
        let items = props.items;
        // console.log('about to render the results');
        return <div>
                <Results totalItems={totalItems} ready={ready} items={items} />
            </div>
}