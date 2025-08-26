import { Member } from "./Member";
import { Project } from "./Project";

export class Crew{
    name: string;
    members: Member[];
    project: Project[]
    
    constructor(name: string, memebers:Member[], project: Project[], components: string[], description: string) {
        this.name = name;
        this.members = memebers;
        this.project = project;
    }
}