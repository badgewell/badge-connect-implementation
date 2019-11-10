export interface IClientCreateRequest {
    client_name: string;
    client_uri: string;
    logo_uri: string;
    tos_uri: string;
    policy_uri: string;
    software_id: string;
    software_version: string;
    redirect_uris: string[];
    token_endpoint_auth_method: string;
    grant_types: string[];
    response_types: string[];
    scope: string;
}
export interface IClientCreateResponse {
    client_id: string;
    client_secret: string;
    client_id_issued_at: number;
    client_secret_expires_at: number;
    client_name: string;
    client_uri: string;
    logo_uri: string;
    tos_uri: string;
    policy_uri: string;
    software_id: string;
    software_version: string;
    redirect_uris: string[];
    token_endpoint_auth_method: string;
    grant_types: string[];
    response_types: string[];
    scope: string;
}
