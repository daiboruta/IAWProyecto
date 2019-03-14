export interface UserDetails {
    _id: string;
    name: string;
    exp: number;
    iat: number;
}

export interface TokenResponse {
    
    token: string;
}
  
export interface TokenPayload {

    password: string;
    name: string;
}
