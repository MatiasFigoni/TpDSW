export function api(relativePath:string,options: { method?: string, body?: any, } = {},role:string = ''){
    const baseUrl = 'http://localhost:3000';
    return fetch(`${baseUrl}${relativePath}`,{ 
            headers: {
                ['Content-Type']: 'application/json',
                ['x-role']: role,
            },
            ...options, 
        }
    )
}