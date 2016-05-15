// wrapper script

// IE10
// Chrome
// FF

// Igor Saric

function wrap(selector: string | HTMLElement | Array<HTMLElement>): Wrapper
{
    return (new Wrapper(document, null)).wrap(selector);
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

        var scope = elements.length > 0 ? elements[0] : null;
        return new Wrapper(scope, elements);
    }

    private first(): HTMLElement
    {
        if (this.any())
        {
            return this._elements[0];
        }

        return null;
    }

    private shiftProps(element: HTMLElement, props: string, value: any): any
    {
        if (props && element)
        {
            var array = props.split('.');
            var prop: any = element;

            while (array.length > 1)
            {
                prop = prop[array.shift()];
            }

            if (value === null)
            {
                return prop[array.shift()];
            }
            else
            {
                prop[array.shift()] = value;
            }
        }

        return null;
    }

    private prop(props: string, value: any): any
    {
        if (value === null)
        {
            return this.shiftProps(this.first(), props, null);
        }
        else
        {
            this._elements.forEach(x => this.shiftProps(x, props, value));
        }

        return null;
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
        var first = this.first();
        if (first)
        {
            return this.wrap(<HTMLElement>first.nextElementSibling);
        }

        return this.wrap(null);
    }

    public parent(): Wrapper
    {
        var first = this.first();
        if (first)
        {
            return this.wrap(first.parentElement);
        }

        return this.wrap(null);
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
        this.prop('style.display', '');
    }

    public hide()
    {
        this.prop('style.display', 'none');
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
    public width(value: number = null): number
    {
        return this.prop('offsetWidth', value);
    }

    public height(value: number = null): number
    {
        return this.prop('offsetHeight', value);
    }

    public positionLeft(value: number = null): number
    {
        return this.prop('offsetLeft', value);
    }

    public positionTop(value: number = null): number
    {
        return this.prop('offsetTop', value);
    }

    // positions
    public top(value: number = null): number
    {
        return this.prop('style.top', value !== null ? value + 'px' : null);
    }

    public right(value: number = null): number
    {
        return this.prop('style.right', value !== null ? value + 'px' : null);
    }

    public bottom(value: number = null): number
    {
        return this.prop('style.bottom', value !== null ? value + 'px' : null);
    }

    public left(value: number = null): number
    {
        return this.prop('style.left', value !== null ? value + 'px' : null);
    }

    // strings
    public css(property: string, value: string = null): string
    {
        return this.prop('style.' + property, value);
    }

    public val(value: string = null): string
    {
        return this.prop('value', value);
    }

    public html(value: string = null): string
    {
        return this.prop('innerHTML', value);
    }

    public id(value: string = null): string
    {
        return this.prop('id', value);
    }

    public src(value: string = null): string
    {
        return this.prop('src', value);
    }

    private addHtml(html: string, append: boolean)
    {
        this._elements.forEach(x => 
        {
            var element = document.createElement('div');
            element.innerHTML = html;

            for (var i = 0; i < element.childNodes.length; i++)
            {
                var node = element.childNodes[i];
                x.insertBefore(node, append ? null : x.firstChild);
            }
        });
    }

    public prependHtml(html: string = null)
    {
        this.addHtml(html, false);
    }

    public appendHtml(html: string = null)
    {
        this.addHtml(html, true);
    }

    // boolean
    public disabled(value: boolean = null): boolean
    {
        return this.prop('disabled', value);
    }

    public checked(value: boolean = null): boolean
    {
        return this.prop('checked', value);
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
