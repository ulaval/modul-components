export class MDOMPlugin {
    public static attach<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): PluginType {
        let plugin: PluginType = element[constructorFunction.defaultMountPoint] as PluginType;
        if (plugin) { plugin.detach(); }

        plugin = new constructorFunction(element, options);
        element[constructorFunction.defaultMountPoint] = plugin;
        return plugin;
    }

    public static get<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
    }, element: HTMLElement): PluginType | undefined {
        return element[constructorFunction.defaultMountPoint];
    }

    public static getRecursive<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
    }, element: HTMLElement): PluginType | undefined {
        let plugin: PluginType | undefined;
        while (element && !plugin) {
            plugin = MDOMPlugin.get(constructorFunction, element);
            element = element.parentNode as HTMLElement;
        }

        return plugin;
    }

    public static update<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
    }, element: HTMLElement, options: OptionsType): PluginType {
        const plugin: PluginType = element[constructorFunction.defaultMountPoint] as PluginType;
        if (plugin) { plugin.update(options); }
        return plugin;
    }

    public static attachUpdate<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): PluginType {
        if (MDOMPlugin.get(constructorFunction, element)) {
            return MDOMPlugin.update(constructorFunction, element, options);
        } else {
            return MDOMPlugin.attach(constructorFunction, element, options);
        }
    }

    public static detach<PluginType extends MElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
    }, element: HTMLElement): void {
        const plugin: PluginType | undefined = MDOMPlugin.get(constructorFunction, element);
        if (plugin) {
            plugin.detach();
            delete element[constructorFunction.defaultMountPoint];
        }
    }
}
export abstract class MElementPlugin<OptionsType> {
    protected attachedEvents: Map<string, EventListenerOrEventListenerObject[]> = new Map<string, EventListenerOrEventListenerObject[]>();
    protected _options: OptionsType;
    private readonly _element: HTMLElement;
    public get element(): HTMLElement { return this._element; }

    public get options(): OptionsType { return this._options; }

    constructor(element: HTMLElement, options: OptionsType) {
        this._element = element;
        this._options = options;
        this.attach();
    }

    public abstract attach(): void;
    public abstract update(options: any): void;
    public abstract detach(): void;

    public addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
        let listeners = this.attachedEvents.get(eventName);
        if (!listeners) {
            this.attachedEvents.set(eventName, [listener]);
        } else {
            if (listeners.indexOf(listener) === -1) {
                listeners.push(listener);
            }
            this.attachedEvents.set(eventName, listeners);
        }

        this.element.addEventListener(eventName, listener);
    }

    public removeEventListener(eventName: string, listener?: EventListenerOrEventListenerObject): void {
        let listeners: EventListenerOrEventListenerObject[] | undefined = this.attachedEvents.get(eventName);
        if (!listeners) { return; }

        if (listener) {
            const eventIndex: number | undefined = listeners.indexOf(listener);
            if (event) {
                this.element.removeEventListener(eventName, listeners[eventIndex]);
                this.attachedEvents.set(eventName, listeners.splice(eventIndex, 1));
            }
        } else {
            listeners.forEach(listener => this.element.removeEventListener(eventName, listener));
            this.attachedEvents.delete(eventName);
        }
    }

    protected removeAllEvents(): void {
        this.attachedEvents
            .forEach((listeners: EventListenerOrEventListenerObject[], eventName: string) => {
                listeners.forEach(listener => this.element.removeEventListener(eventName, listener));
            });
    }
}
