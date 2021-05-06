import { IsNumber, IsString } from "class-validator";

export class UserDetails {
    @IsNumber()
    age: number;
    @IsString()
    dob: String;

    constructor(age: number, dob: string) {
        this.age = age;
        this.dob = dob;
    }
}