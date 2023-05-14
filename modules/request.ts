import { get } from "https";
import { RequestGetCallback } from "../types";

export class request {
    static get(url, callback: RequestGetCallback) {
        get(url, (resp) => {
            let data = '';
    
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            let error;
            resp.on("err", (err) => {
                error = err;
            });
            resp.on('end', () => {
                let body = JSON.parse(data)
                callback(error, body, data);
            })
        });
    }
}