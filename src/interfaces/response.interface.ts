interface Responses {
    response: {
      status: number;
      message: string;
      error: boolean;
      data: object;
    };
  }
  
  interface GenericSuccess {
    status?: number;
    error?: boolean;
    message: string;
    data: object;
  }
  interface GenericError {
    message?: string;
    status?: boolean;
    error?: Array<object> | object | string;
    field?: string;
    errorMessage?: string;
  }
  
  interface GenericRequestPusher {
    jwtData?: string;
    userId?: string;
    adminRole?: string;
  }
  
  export { Responses, GenericSuccess, GenericError, GenericRequestPusher };
  