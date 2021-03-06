# wrapper
Small TypeScript class that emulates jQuery. The purpose is to provide basic jQuery DOM manipulation functionality while keeping the code base as small as possible (around 4KB minified, non-gzipped).

The following methods are supported:

```
wrap("#selector") : Wrapper                              // wrap id
wrap(".selector") : Wrapper                              // wrap class
wrap("selector") : Wrapper                               // wrap tag
wrap(HTMLElement) : Wrapper                              // wrap HTMLElement
wrap().any() : boolean                                   // selector exists
wrap().except(selector: Wrapper) : Wrapper               // wrap elements except selector
wrap().next(): Wrapper                                   // returns next sibling
wrap().parent(): Wrapper                                 // returns parent element
wrap().visible(): boolean                                // returns if element is visible
wrap().toggle(): void                                    // toggle element visibility
wrap().show(): void                                      // show element
wrap().hide(): void                                      // hide element
wrap().remove(): void                                    // remove element
wrap().hasClass(className: string)                       // check if element contains class
wrap().addClass(className: string)                       // add class to element
wrap().removeClass(className: string)                    // remove class from element
wrap().toggleClass(className: string)                    // toggle class on element
wrap().width(value?: number): number                     // get or set element width
wrap().height(value?: number): number                    // get or set element height
wrap().offset(value?: Offset): Offset                    // get or set element offset
wrap().position(value?: Position): Position              // get or set element position
wrap().css(property: string, value?: string): string     // get or set element css property value
wrap().val(value?: string): string                       // get or set element value
wrap().html(value?: string): string                      // get or set element html
wrap().id(value?: string): string                        // get or set element id
wrap().src(value?: string): string                       // get or set element src
wrap().prependHtml(html?: string)                        // prepend html
wrap().appendHtml(html?: string)                         // append html
wrap().disabled(value?: boolean): boolean                // get or set disabled element value
wrap().checked(value?: boolean): boolean                 // get or set checked element value
wrap().translate(x: number, y: number)                   // translate element
wrap().all(): Array<Wrapper>                             // unpack elements
wrap().on(action: string, callback: EventCallback): void // set event on element


```
