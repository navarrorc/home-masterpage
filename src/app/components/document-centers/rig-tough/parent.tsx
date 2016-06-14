import * as React from 'react';
import { Results } from './results';

/***
 * Parent Component (stateless)
 */
export const Parent = (props)=> {
        let totalItems = props.totalItems;
        let ready = props.ready;
        let groupedItems = props.groupedItems;
        return <div>
                <Results totalItems={totalItems} ready={ready} groupedItems={groupedItems} />
            </div>
}