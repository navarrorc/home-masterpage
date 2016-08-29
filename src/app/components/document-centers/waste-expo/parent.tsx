import * as React from 'react';
import { Results } from './results';

/**
 * Parent Component (stateless)
 */
export const Parent = (props)=> {
	return <div>
		<Results {...props} />
	</div>
}