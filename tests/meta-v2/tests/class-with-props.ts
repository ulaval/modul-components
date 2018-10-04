@Component
export class ClassWithProp {

    @Prop({
        default: MAccordionSkin.Default,
    })
    public prop1: string;

    @Prop()
    public prop2: string;


    private prop2: string;
}


