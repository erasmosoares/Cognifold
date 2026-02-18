import create from './http-service';

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}


export default create('/users');