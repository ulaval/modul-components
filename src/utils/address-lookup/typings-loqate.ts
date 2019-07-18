export interface LoqateFindRequest {
    Key: string;
    Text: string;
    Container?: string;
    Origin?: string;
    Language?: string;
}

export interface LoqateRetrieveRequest {
    Key: string;
    Id: string;
}

export interface LoqateFindResult {
    Items: LoqateFindItem[];
}

export interface LoqateFindItem {
    Id: string;
    Type: string;
    Text: string;
    Highlight: string;
    Description: string;
}

export interface LoqateRetrieveResult {
    Items: LoqateRetrieveItem[];
}

export interface LoqateRetrieveItem {
    Language: string;
    LanguageAlternatives: string;
    BuildingNumber: string;
    SubBuilding: string;
    Street: string;
    District: string;
    City: string;
    ProvinceName: string;
    ProvinceCode: string;
    PostalCode: string;
    CountryName: string;
    CountryIso2: string;
    CountryIso3: string;
    Label: string;
}
