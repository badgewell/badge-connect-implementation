export interface IBadgeConnectAPI {
    id: string;
    type: string;
    apiBase: string;
    authorizationUrl: string;
    image: string;
    name: string;
    privacyPolicyUrl: string;
    registrationUrl: string;
    scopesOffered: string[];
    termsOfServiceUrl: string;
    tokenUrl: string;
    version: string;
}

export interface IManifestResponse {
    id: string;
    type: string;
    badgeConnectAPI: IBadgeConnectAPI[];
}
