export interface IAssertion {
  id: string;
  type: string;
  '@context': string;
  badge: string;
  image: string;
  verification: IVerification;
  evidence: IEvidence[];
  narrative: string;
  issuedOn: string;
  expires: string;
  recipient: IRecipient;
}

export interface IEvidence {
  type: string;
  id: string;
}

export interface IExtensionsRecipientProfile {
  '@context': string;
  type: string[];
  name: string;
}

export interface IRecipient {
  salt: string;
  type: string;
  hashed: boolean;
  identity: string;
}

export interface IVerification {
  type: string;
}
