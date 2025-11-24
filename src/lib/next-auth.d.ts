
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      isbanned: boolean | unknown;
      role: string | unknown;
      profileImage: string;
      username: string;
      email: string;
      verified: unknown;
      user: string;
      id: string;
      name: string;
      image: string;
    };
  }

}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
  }
}