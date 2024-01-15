export interface Repository {
  setting(config: object): Promise<unknown>;
}
