export function api(relativePath:string,options: { method?: string, body?: any, } = {}){
    const baseUrl = 'http://localhost:3000';
    return fetch(`${baseUrl}${relativePath}`,{ 
            headers: {
                ['Content-Type']: 'application/json'
            },
            ...options, 
        }
    )
}