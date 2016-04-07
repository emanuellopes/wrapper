// wrapper script

// IE10
// Chrome
// FF

// Igor Saric

function wrap(selector: string | HTMLElement): Wrapper
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

    public wrap(selector: string | HTMLElement): Wrapper
    {
        var elements: Array<HTMLElement> = new Array<HTMLElement>();

        if (selector && this._scope)
        {
            if (typeof selector === 'string')
            {
                if (selector.substring(0, 1) == '#')
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

                    if (selector.substring(0, 1) == '.')
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
        }

        var scope = elements.length > 0 ? elements[0] : null;
        return new Wrapper(scope, elements);
    }

    private isTrueForAtLeastOneElement(action: (element: HTMLElement) => boolean): boolean
    {
        var result: boolean = false;

        this._elements.forEach(x => 
        {
            if (!result && action(x))
            {
                result = true;
            }
        });

        return result;
    }

    // public methods below this point

    public first(): HTMLElement
    {
        if (this.any())
        {
            return this._elements[0];
        }

        return null;
    }

    public elements(): Array<HTMLElement>
    {
        return this._elements;
    }

    public any(): boolean
    {
        return this._elements.length > 0;
    }

    public next(): Wrapper
    {
        var first = this.first();
        if (first)
        {
            var next = <HTMLElement>first.nextElementSibling;
            return this.wrap(next);
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
        return this.isTrueForAtLeastOneElement(x =>
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
        this._elements.forEach(x => 
        {
            x.style.display = '';
        });
    }

    public hide()
    {
        this._elements.forEach(x => 
        {
            x.style.display = 'none';
        });
    }

    // classes
    public hasClass(className: string): boolean
    {
        return this.isTrueForAtLeastOneElement(x =>
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

    public getCss(property: string): string
    {
        var first = this.first();
        if (first && (property in first.style))
        {
            return first.style[property];
        }

        return null;
    }

    public setCss(property: string, value: string)
    {
        this._elements.forEach(x =>
        {
            if (property in x.style)
            {
                x.style[property] = value;
            }
        });
    }

    public width(): number
    {
        var first = this.first();
        if (first)
        {
            return first.offsetWidth;
        }

        return null;
    }

    public height(): number
    {
        var first = this.first();
        if (first)
        {
            return first.offsetHeight;
        }

        return null;
    }

    public val(): any
    {
        var first = this.first();
        if (first)
        {
            return (<HTMLInputElement>first).value;
        }

        return null;
    }

    // html
    public setHtml(html: string)
    {
        this._elements.forEach(x =>
        {
            x.innerHTML = html;
        });
    }

    public getHtml(): string
    {
        var first = this.first();
        if (first)
        {
            return first.innerHTML;
        }

        return null;
    }

    public replaceInHtml(search: string, replacement: string)
    {
        var first = this.first();
        if (first)
        {
            first.innerHTML = first.innerHTML.replace(new RegExp(search, 'g'), replacement);
        }
    }

    // event 
    public addEvent(event: string, execute: (event) => void)
    {
        this._elements.forEach(x =>
        {
            x.addEventListener(event, execute);
        });
    }
}
