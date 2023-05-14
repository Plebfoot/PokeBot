export interface HelpObject {
    "commandName": string,
    "description": string,
    "category": string
    "aliases": Array<string> | string,
    "usage": Array<string> | string,
    "exclude": boolean
}


export interface RequestGetCallback {
    (error: Error, body?: any, response?: string,)
}

export class Pokemon {
    public static lastSpawnedPokemon: string;
    public static caughtPokemon: boolean = false;
}