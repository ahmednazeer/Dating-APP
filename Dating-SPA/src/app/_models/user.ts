import { Photo } from './photo';

export interface User {
    id:number;
    age:number;
    username:string;
    knownAs:string;
    photoUrl:string;
    gender:string;
    city:string;
    country:string;
    lastActive:Date;
    created:Date;
    //optional params
    interests?:string;
    introduction?:string;
    lookingFor?:string;
    photos?:Photo[];

}
