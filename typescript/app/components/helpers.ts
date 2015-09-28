module C {
  /**
  * Helper functions
  **/

  export function isMounted(component:any) {
    // see: http://jaketrent.com/post/set-state-in-callbacks-in-react/
    try {
      React.findDOMNode(component);
      return true;
    } catch (e) {
      // Error: Invariant Violation: Component (with keys: props,context,state,refs,_reactInternalInstance) contains `render` method but is not mounted in the DOM
      return false;
    }
  };
}
