
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
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