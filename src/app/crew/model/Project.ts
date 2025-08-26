export class Project {
    name: string;
    components: string[];
    description: string;

    constructor(name: string, components: string[], description: string) {
        this.name = name;
        this.components = components;
        this.description = description;
    }
}