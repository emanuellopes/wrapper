// wrapper script

// IE10
// Chrome
// FF

// Igor Saric

function wrap(selector: string | HTMLElement | Array<HTMLElement>): Wrapper
{
    return (new Wrapper(document, undefined)).wrap(selector);
}

class Wrapper
{
    private _scope: Document | HTMLElement;
    private _elements: Array<HTMLElement>;

    constructor(scope: Document | HTMLElement, elements: Array<HTMLElement>)
    {
        this._scope = scope;
        this._elements = elements;
    }

    public wrap(selector: string | HTMLElement | Array<HTMLElement>): Wrapper
    {
        var elements: Array<HTMLElement> = new Array<HTMLElement>();

        if (selector && this._scope)
        {
            if (typeof selector === 'string')
            {
                if (selector.charAt(0) === '#')
                {
                    var htmlElement = document.getElementById(selector.substring(1));
                    if (htmlElement)
                    {
                        elements.push(htmlElement);
                    }
                }
                else
                {
                    var htmlElements: NodeListOf<Element>;

                    if (selector.charAt(0) === '.')
                    {
                        htmlElements = this._scope.getElementsByClassName(selector.substring(1));
                    }
                    else
                    {
                        htmlElements = this._scope.getElementsByTagName(selector);
                    }

                    for (var i = 0; i < htmlElements.length; i++)
                    {
                        var element = htmlElements[i];
                        if (element instanceof HTMLElement)
                        {
                            elements.push(element);
                        }
                    }
                }
            }
            else if (selector instanceof HTMLElement)
            {
                elements.push(selector);
            }
            else if (selector instanceof Array)
            {
                elements.push.apply(elements, selector);
            }
        }

        var scope = elements.length > 0 ? elements[0] : undefined;
        return new Wrapper(scope, elements);
    }

    private _first(): HTMLElement
    {
        if (this.any())
        {
            return this._elements[0];
        }

        return undefined;
    }

    private _splitProps(element: HTMLElement, props: string, value: any): any
    {
        if (props && element)
        {
            var array = props.split('.');
            var prop: any = element;

            while (array.length > 1)
            {
                prop = prop[array.shift()];
            }

            if (value === undefined)
            {
                return prop[array.shift()];
            }
            else
            {
                prop[array.shift()] = value;
            }
        }

        return undefined;
    }

    private _prop(props: string, value: any): any
    {
        if (value === undefined)
        {
            return this._splitProps(this._first(), props, undefined);
        }
        else
        {
            this._elements.forEach(x => this._splitProps(x, props, value));
        }

        return undefined;
    }

    private _px(value: any): string
    {
        return !isNaN(parseFloat(value)) ? value + 'px' : value;
    }

    // public methods below this point

    public any(): boolean
    {
        return this._elements.length > 0;
    }

    public except(selector: Wrapper): Wrapper
    {
        return wrap(this._elements.filter(x => selector._elements.indexOf(x) === -1));
    }

    public next(): Wrapper
    {
        var first = this._first();
        if (first)
        {
            return this.wrap(<HTMLElement>first.nextElementSibling);
        }

        return this.wrap(undefined);
    }

    public parent(): Wrapper
    {
        var first = this._first();
        if (first)
        {
            return this.wrap(first.parentElement);
        }

        return this.wrap(undefined);
    }

    // visibility
    public visible(): boolean
    {
        return this._elements.some(x =>
        {
            return x.style.display !== 'none';
        });
    }

    public toggle()
    {
        if (this.visible())
        {
            this.hide();
        }
        else
        {
            this.show();
        }
    }

    public show()
    {
        this.css('display', '');
    }

    public hide()
    {
        this.css('display', 'none');
    }

    public remove()
    {
        this._elements.forEach(x => 
        {
            if (x && x.parentNode)
            {
                x.parentNode.removeChild(x);
            }
        });
    }

    // classes
    public hasClass(className: string): boolean
    {
        return this._elements.some(x =>
        {
            return x.classList.contains(className);
        });
    }

    public addClass(className: string)
    {
        this._elements.forEach(x => 
        {
            if (!x.classList.contains(className))
            {
                x.classList.add(className);
            }
        });
    }

    public removeClass(className: string)
    {
        this._elements.forEach(x => 
        {
            x.classList.remove(className);
        });
    }

    public toggleClass(className: string)
    {
        if (this.hasClass(className))
        {
            this.removeClass(className);
        }
        else
        {
            this.addClass(className);
        }
    }

    // size
    public width(value?: number): number
    {
        return parseInt(this.css('width', this._px(value)));
    }

    public height(value?: number): number
    {
        return parseInt(this.css('height', this._px(value)));
    }

    public offset(value?: { top?: number, left?: number, width?: number, height?: number })
    {
        var coordinates =
        {
            top: parseInt(this._prop('offsetTop', this._px(value ? value.top : undefined))),
            left: parseInt(this._prop('offsetLeft', this._px(value ? value.left : undefined))),
            width: parseInt(this._prop('offsetWidth', this._px(value ? value.width : undefined))),
            height: parseInt(this._prop('offsetHeight', this._px(value ? value.height : undefined))),
        }

        return coordinates;
    }

    public position(value?: { top?: number, left?: number, bottom?: number, right?: number })
    {
        var coordinates =
        {
            top: parseInt(this.css('top', this._px(value ? value.top : undefined))),
            left: parseInt(this.css('left', this._px(value ? value.left : undefined))),
            bottom: parseInt(this.css('bottom', this._px(value ? value.bottom : undefined))),
            right: parseInt(this.css('right', this._px(value ? value.right : undefined))), 
        }

        return coordinates;
    }

    // strings
    public css(property: string, value?: string): string
    {
        return this._prop('style.' + property, value);
    }

    public val(value?: string): string
    {
        return this._prop('value', value);
    }

    public html(value?: string): string
    {
        return this._prop('innerHTML', value);
    }

    public id(value?: string): string
    {
        return this._prop('id', value);
    }

    public src(value?: string): string
    {
        return this._prop('src', value);
    }

    private _addHtml(html: string, append: boolean)
    {
        this._elements.forEach(x => 
        {
            var element = document.createElement('div');
            element.innerHTML = html;

            for (var i = 0; i < element.childNodes.length; i++)
            {
                var node = element.childNodes[i];
                x.insertBefore(node, append ? undefined : x.firstChild);
            }
        });
    }

    public prependHtml(html?: string)
    {
        this._addHtml(html, false);
    }

    public appendHtml(html?: string)
    {
        this._addHtml(html, true);
    }

    // boolean
    public disabled(value?: boolean): boolean
    {
        return this._prop('disabled', value);
    }

    public checked(value?: boolean): boolean
    {
        return this._prop('checked', value);
    }

    // translate
    public translate(x: number, y: number)
    {
        var value = 'translate(' + x + 'px,' + y + 'px)';

        this.css('transform', value);
        this.css('-moz-transform', value);
        this.css('-ms-transform', value);
        this.css('-o-transform', value);
        this.css('-webkit-transform', value);
    }

    public all(): Array<Wrapper>
    {
        var result = new Array<Wrapper>();
        this._elements.forEach(x =>
        {
            result.push(wrap(x));
        });
        return result;
    }

    // event 
    public on(eventName: string, execute: (event: any, sender: HTMLElement) => void)
    {
        this._elements.forEach(x =>
        {
            x.addEventListener(eventName, (event) =>
            {
                execute(event, x);
            });
        });
    }
}

// keep under 500 lines
