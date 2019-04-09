export default class LoqateRetrieve {

    constructor(buildingNumber: string = '',
        street: string = '',
        city: string = '',
        provinceName: string = '',
        postalCode: string = '',
        countryName: string = '',
        subBuilding: string = '') {

        this.buildingNumber = buildingNumber;
        this.street = street;
        this.city = city;
        this.provinceName = provinceName;
        this.postalCode = postalCode;
        this.countryName = countryName;
        this.subBuilding = subBuilding;
    }

    public static fromJson(json: any): LoqateRetrieve {
        return new LoqateRetrieve(json.BuildingNumber, json.Street, json.City, json.ProvinceName, json.PostalCode, json.CountryName, json.SubBuilding);
    }

    public isEmpty(): boolean {
        return this.countryName.length === 0;
    }

    public completeBuildingNumber(): string {
        if (this.subBuilding.length === 0) {
            return this.buildingNumber;
        }

        if (this.buildingNumber.length === 0) {
            return this.subBuilding;
        }

        return `${this.subBuilding}-${this.buildingNumber}`;
    }

    public adresseFormatted(): string {
        return `${this.completeBuildingNumber()}, ${this.street}, ${this.city}, ${this.provinceName} ${this.countryName}, ${this.postalCode}`;
    }

    public isFromQuebec(): boolean {
        const firstPostalCodeLetter: string = this.postalCode[0].toUpperCase();
        return firstPostalCodeLetter === 'G' || firstPostalCodeLetter === 'H' || firstPostalCodeLetter === 'J';
    }

    buildingNumber: string;
    street: string;
    city: string;
    provinceName: string;
    postalCode: string;
    countryName: string;
    subBuilding: string;
}
