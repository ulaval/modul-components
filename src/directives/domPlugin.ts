export type MountFunction = (callback: MountCallback) => void;
export type RefreshFunction = (callback: MountCallback) => void;
export type MountCallback = () => void;
export class MDOMPlugin {
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

    public static attach<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): IMElementPlugin<OptionsType> {
        if (MDOMPlugin.get(constructorFunction, element)) {
            return MDOMPlugin.internalUpdate(constructorFunction, element, options);
        } else {
            return MDOMPlugin.internalAttach(constructorFunction, element, options);
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

    private static internalAttach<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): IMElementPlugin<OptionsType> {
        let plugin: IMElementPlugin<OptionsType> = element[constructorFunction.defaultMountPoint] as IMElementPlugin<OptionsType>;
        if (plugin) { MDOMPlugin.detach(constructorFunction, element); }

        plugin = new constructorFunction(element, options);
        if (this.mountPlugin(plugin)) {
            element[constructorFunction.defaultMountPoint] = plugin;
            return plugin;
        } else {
            return new NullObjectMElementPlugin(options);
        }
    }

    private static internalUpdate<PluginType extends IMElementPlugin<OptionsType>, OptionsType>(constructorFunction: {
        defaultMountPoint: string;
        new (element: HTMLElement, options: OptionsType): PluginType;
    }, element: HTMLElement, options: OptionsType): IMElementPlugin<OptionsType> {
        const plugin: PluginType = element[constructorFunction.defaultMountPoint] as PluginType;
        if (plugin) {
            if (!this.refreshPlugin(plugin, options)) {
                MDOMPlugin.detach(constructorFunction, element);
                return new NullObjectMElementPlugin(options);
            }
        }
        return plugin;
    }

    private static mountPlugin(plugin: IMElementPlugin<any>): boolean {
        let mounted: boolean = false;
        plugin.attach(this.getMountFunction(() => mounted = true));
        return mounted;
    }

    private static refreshPlugin(plugin: IMElementPlugin<any>, options): boolean {
        let updated: boolean = false;
        plugin.update(options, this.getMountFunction(() => updated = true));
        return updated;
    }

    private static getMountFunction: (onSuccess: () => void) => MountFunction = (onSuccess: () => void) => {
        return (callback: MountCallback) => {
            callback();
            onSuccess();
        };
    }
}

export interface IMElementPlugin<OptionsType> {
    element: HTMLElement;
    options: OptionsType;
    attach(mount: MountFunction): void;
    update(options: any, refresh: RefreshFunction): void;
    detach(): void;
    addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void;
    removeEventListener(eventName: string, listener?: EventListenerOrEventListenerObject): void;
    removeAllEvents(): void;
}

class NullObjectMElementPlugin<OptionsType> implements IMElementPlugin<OptionsType> {
    element: HTMLElement;
    options: OptionsType;
    constructor(options: OptionsType) {
        this.options = options;
    }
    attach(mount: MountFunction): void {}
    update(options: any, refresh: RefreshFunction): void {}
    detach(): void {}
    addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void {}
    removeEventListener(eventName: string, listener?: EventListener | EventListenerObject | undefined): void {}
    removeAllEvents(): void {}
}

export abstract class MElementPlugin<OptionsType> implements IMElementPlugin<OptionsType> {
    protected attachedEvents: Map<string, EventListenerOrEventListenerObject[]> = new Map<string, EventListenerOrEventListenerObject[]>();
    protected _options: OptionsType;
    private readonly _element: HTMLElement;

    public get element(): HTMLElement { return this._element; }
    public get options(): OptionsType { return this._options; }

    constructor(element: HTMLElement, options: OptionsType) {
        this._element = element;
        this._options = options;
    }

    public abstract attach(mount: MountFunction): void;
    public abstract update(options: any, refresh: RefreshFunction): void;
    public abstract detach(): void;

    public addEventListener(eventName: string, listener: EventListenerOrEventListenerObject): void {
        let listeners = this.attachedEvents.get(eventName);
        if (!listeners) {
            this.attachedEvents.set(eventName, [listener]);
            this.element.addEventListener(eventName, listener);
        } else {
            if (listeners.indexOf(listener) === -1) {
                listeners.push(listener);
                this.element.addEventListener(eventName, listener);
            }
            this.attachedEvents.set(eventName, listeners);
        }
    }

    public removeEventListener(eventName: string): void {
        let listeners: EventListenerOrEventListenerObject[] | undefined = this.attachedEvents.get(eventName);
        if (!listeners) { return; }

        listeners.forEach(listener => {
            this.element.removeEventListener(eventName, listener);
        });
        this.attachedEvents.delete(eventName);
    }

    public removeAllEvents(): void {
        this.attachedEvents
            .forEach((listeners: EventListenerOrEventListenerObject[], eventName: string) => {
                this.removeEventListener(eventName);
            });
    }
}
