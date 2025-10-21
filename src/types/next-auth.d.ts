declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    issued?: string;
    expires?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    issued?: string;
    expires?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
    issued?: string;
    expires?: string;
  }
}