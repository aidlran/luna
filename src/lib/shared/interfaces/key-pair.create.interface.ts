export interface IKeyPairCreate {
  /** An armored, encrypted PGP private key. */
  privateKey: string;
  /** An armored PGP public key derived from the private key. */
  publicKey: string;
}
