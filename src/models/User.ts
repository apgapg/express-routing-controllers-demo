import { isDefined, IsNotEmpty } from "class-validator";

export class User {
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    uid: string;
    @IsNotEmpty()
    authToken: string;

    constructor(firstName: string, lastName: string, uid: string, authToken: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.uid = uid;
        this.authToken = authToken;
    }

    getName(): string {
        return this.lastName + ' ' + this.firstName;
    }
}
