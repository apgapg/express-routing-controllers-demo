import { isDefined, IsNotEmpty } from "class-validator";

export class User {
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getName(): string {
        return this.lastName + ' ' + this.firstName;
    }
}
