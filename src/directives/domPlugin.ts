export class MDOMPlugin {
    public static attach<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): IMElementPlugin<OptionsType> {
        let plugin: IMElementPlugin<OptionsType> = element[constructorFunction.defaultMountPoint] as IMElementPlugin<OptionsType>;
        if (plugin) { MDOMPlugin.detach(constructorFunction, element); }

        plugin = new constructorFunction(element, options);
        if (plugin.status === MElementPluginStatus.Mounted) {
            element[constructorFunction.defaultMountPoint] = plugin;
            return plugin;
        } else {
            return new NullObjectMElementPlugin(options);
        }
    }

    public static get<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement): IMElementPlugin<OptionsType> | undefined {
        return element[constructorFunction.defaultMountPoint];
    }

    public static getRecursive<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement): IMElementPlugin<OptionsType> | undefined {
        let plugin: IMElementPlugin<OptionsType> | undefined;
        while (element && !plugin) {
            plugin = MDOMPlugin.get(constructorFunction, element);
            element = element.parentNode as HTMLElement;
        }

        return plugin;
    }

    public static attachUpdate<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): IMElementPlugin<OptionsType> {
        if (MDOMPlugin.get(constructorFunction, element)) {
            return MDOMPlugin.update(constructorFunction, element, options);
        } else {
            return MDOMPlugin.attach(constructorFunction, element, options);
        }
    }

    public static detach<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement): void {
        const plugin: IMElementPlugin<OptionsType> | undefined = MDOMPlugin.get(constructorFunction, element);
        if (plugin) {
            plugin.detach();
            delete element[constructorFunction.defaultMountPoint];
        }
    }

    private static update<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): PluginType {
        const plugin: PluginType = element[constructorFunction.defaultMountPoint] as PluginType;
        if (plugin) { plugin.update(options); }
        return plugin;
    }
}

export type MountFunction = (callback: () => void) => void;
export interface IMElementPlugin<OptionsType> {
    element: HTMLElement;
    options: OptionsType;
    status: MElementPluginStatus;
    attach(mount: MountFunction): void;
    update(options: any): void;
    detach(): void;
    addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void;
    removeEventListener(eventName: string, listener?: EventListenerOrEventListenerObject): void;
    removeAllEvents(): void;
}

class NullObjectMElementPlugin<OptionsType> implements IMElementPlugin<OptionsType> {
    element: HTMLElement;
    options: OptionsType;
    status: MElementPluginStatus;
    constructor(options: OptionsType) {
        this.options = options;
    }
    attach(mount: MountFunction): void {}
    update(options: any): void {}
    detach(): void {}
    addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void {}
    removeEventListener(eventName: string, listener?: EventListener | EventListenerObject | undefined): void {}
    removeAllEvents(): void {}
}

export enum MElementPluginStatus {
    Mounted = 'mounted',
    UnMounted = 'unmounted'
}
export abstract class MElementPlugin<OptionsType> implements IMElementPlugin<OptionsType> {
    protected attachedEvents: Map<string, EventListenerOrEventListenerObject[]> = new Map<string, EventListenerOrEventListenerObject[]>();
    protected _options: OptionsType;
    private readonly _element: HTMLElement;
    private _status: MElementPluginStatus = MElementPluginStatus.UnMounted;

    public get element(): HTMLElement { return this._element; }
    public get options(): OptionsType { return this._options; }
    public get status(): MElementPluginStatus { return this._status; }

    constructor(element: HTMLElement, options: OptionsType) {
        this._element = element;
        this._options = options;
        this.attach(this.mount);
    }

    public abstract attach(mount: MountFunction): void;
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

    public removeAllEvents(): void {
        this.attachedEvents
            .forEach((listeners: EventListenerOrEventListenerObject[], eventName: string) => {
                listeners.forEach(listener => this.element.removeEventListener(eventName, listener));
            });
    }

    private mount: MountFunction = (callback: () => void) => {
        callback();
        this._status = MElementPluginStatus.Mounted;
    }
}
