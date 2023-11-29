type Config = {
    ServerRootUrl: string;
    WebRootUrl: string;
}
const DevConfig: Config = {
    ServerRootUrl: `http://localhost:3001`,
    WebRootUrl: `http://localhost:3000`
}

const ProdConfig: Config = {
    ServerRootUrl: `http://localhost:3000`,
    WebRootUrl: `http://localhost:3000`
}

export const Config = import.meta.env.DEV ? DevConfig : ProdConfig