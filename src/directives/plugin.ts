export class MDOMPlugin {
    public static attach<PluginType extends MElementPlugin<OptionsType>, OptionsType>(c: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): PluginType {
        const plugin = new c(element, options);
        element[c.defaultMountPoint] = new c(element, options);
        return plugin;
    }

    public static get<PluginType extends MElementPlugin<OptionsType>, OptionsType>(c: {
        defaultMountPoint: string;
    }, element: HTMLElement): PluginType | undefined {
        return element[c.defaultMountPoint];
    }

    public static update<PluginType extends MElementPlugin<OptionsType>, OptionsType>(c: {
        defaultMountPoint: string;
    }, element: HTMLElement, options: OptionsType): void {
        const plugin: PluginType = element[c.defaultMountPoint] as PluginType;
        if (plugin) plugin.update(options);
    }

    public static detach<PluginType extends MElementPlugin<OptionsType>, OptionsType>(c: {
        defaultMountPoint: string;
    }, element: HTMLElement): void {
        const plugin: PluginType = element[c.defaultMountPoint] as PluginType;
        if (plugin) {
            plugin.detach();
            delete element[c.defaultMountPoint];
        }
    }
}
export abstract class MElementPlugin<OptionsType> {
    protected _options: OptionsType;
    private readonly _element: HTMLElement;
    public get element(): HTMLElement { return this._element; }

    public get options(): OptionsType { return this._options; }

    private attachedEvents: Map<string, EventListenerOrEventListenerObject[]> = new Map<string, EventListenerOrEventListenerObject[]>();

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

    public removeEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
        let listeners: EventListenerOrEventListenerObject[] | undefined = this.attachedEvents.get(eventName);
        if (!listeners) return;

        const eventIndex: number | undefined = listeners.indexOf(listener);
        if (event) {
            this.element.removeEventListener(eventName, listeners[eventIndex]);
            this.attachedEvents.set(eventName, listeners.splice(eventIndex, 1));
        }
    }

    protected removeAllEvents(): void {
        this.attachedEvents
            .forEach((listeners: EventListenerOrEventListenerObject[], eventName: string) => {
                listeners.forEach(listener => this.element.removeEventListener(eventName, listener));
            });
    }
}
