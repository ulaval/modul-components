export enum MCurrencyType {
    NONE = '',
    CAD = 'CAD',
    USD = 'USD',
    EUR = 'EUR'
}

export class MMoney {
    amount: number;
    currency: MCurrencyType;
}

export class MMoneyFactory {
    static create(): MMoney {
        return new MMoney();
    }

    static createAllParams(amount?: number, currency?: MCurrencyType): MMoney {
        const money: MMoney = this.create();
        money.amount = amount!;
        money.currency = currency!;

        return money;
    }
}
