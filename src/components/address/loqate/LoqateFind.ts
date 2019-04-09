export default class LoqateFind {
    id: string;
    description: string;
    text: string;
    type: string;
    highlight: string;

    constructor(json: any) {
        this.id = json.Id;
        this.description = json.Description;
        this.text = json.Text;
        this.type = json.Type;
        this.highlight = json.Highlight;
    }

    public isAddress(): boolean {
        return this.type === 'Address';
    }
}
