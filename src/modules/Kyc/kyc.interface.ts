
interface userInterface{
    name:string,
    age:number,
    email:string
}

interface response {

    status: number,
    error: boolean,
    message?: string,
    data?: any
}

interface error {
    message: string,
    error?: any
}


export{
    userInterface,
    response,
    error
}