# wrapper
Small TypeScript class that emulates basic jQuery functionality.

The following methods are supported:

```
wrap("#selector") : Wrapper                // wrap id
wrap(".selector") : Wrapper                // wrap class
wrap().any() : boolean                     // selector exists
wrap().except(selector: Wrapper) : Wrapper // wrap elements except selector
wrap().next(): Wrapper                     // return next sibling
wrap().parent(): Wrapper                   // return parent element
wrap().visible(): boolean                  // return if element is visible
```
