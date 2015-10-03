//import React = require('react');

/**
* Helper functions
**/
export function isMounted(component:any) {
  // see: http://jaketrent.com/post/set-state-in-callbacks-in-react/
  // In summary we have to create our own isMounted function because it does not exist anymore in version 0.13
  //  but we did get support for ES6 classes.
  try {
    React.findDOMNode(component);
    return true;
  } catch (e) {
    // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
    return false;
  }
};
