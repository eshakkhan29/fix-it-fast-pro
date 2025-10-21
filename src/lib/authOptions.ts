import { AuthSession, AuthenticatedUser } from '@/types/auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { IframeJWTProvider } from './IframeJWTProvider';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Step 1: Login request
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error('Error response:', text);
            return null;
          }

          // Step 2: Parse token response
          let tokenData;
          try {
            const responseText = await res.text();
            try {
              const jsonString = JSON.parse(responseText);
              tokenData = JSON.parse(jsonString);
            } catch {
              tokenData = JSON.parse(responseText);
            }
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            return null;
          }

          if (
            !tokenData.UserId ||
            !tokenData.Email ||
            !tokenData.access_token
          ) {
            return null;
          }

          const userId = tokenData.UserId;
          const accessToken = tokenData.access_token;

          // Step 3: Fetch user's account info
          let accounts: any[] = [];
          try {
            const accountRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/clientaccounts/GetUserAccountsByUserId?userId=${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: 'application/json',
                },
              }
            );

            if (accountRes.ok) {
              const accountData = await accountRes.json();
              if (Array.isArray(accountData) && accountData.length > 0) {
                accounts = accountData;
              }
            } else {
              console.warn(
                'Failed to fetch accounts:',
                await accountRes.text()
              );
            }
          } catch (err) {
            console.error('Error fetching accounts:', err);
          }

          // Step 4: Pick first account ID for role fetching (optional)
          let roles: any[] = [];
          const firstAccountId = accounts.length > 0 ? accounts[0].Id : null;
          const accountUserName = accounts.length > 0 ? accounts[0].Name : '';

          if (firstAccountId) {
            try {
              const rolesRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Roles/GetByUserIdAccountId?userId=${userId}&accountId=${firstAccountId}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                  },
                }
              );

              if (rolesRes.ok) {
                roles = await rolesRes.json();
              } else {
                console.warn('Failed to fetch roles:', await rolesRes.text());
              }
            } catch (err) {
              console.error('Error fetching roles:', err);
            }
          }

          // Step 5: Return combined user info
          const user: AuthenticatedUser = {
            id: userId,
            email: tokenData.Email,
            name: accountUserName,
            accessToken,
            tokenType: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            issued: new Date(Date.now()).toISOString(),
            expires: new Date(
              Date.now() + tokenData.expires_in * 1000
            ).toISOString(),
            accountId: firstAccountId,
            roles,
          };

          return user;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    IframeJWTProvider, // iframe login provider
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user?: AuthenticatedUser }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.tokenType = user.tokenType;
        token.expiresIn = user.expiresIn;
        token.issued = user.issued;
        token.expires = user.expires;
        token.accountId = user.accountId;
        token.roles = user.roles;
      }
      return token;
    },

    async session({ token, session }: { token: any; session: AuthSession }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
      };
      session.accessToken = token.accessToken as string;
      session.tokenType = token.tokenType as string;
      session.expiresIn = token.expiresIn as number;
      session.issued = token.issued as string;
      session.expires = token.expires as string;
      session.accountId = token.accountId as string;
      session.roles = token.roles || [];
      return session;
    },

    async signIn({ user }: { user: AuthenticatedUser }) {
      try {
        if (!user || !user.id || !user.email || !user.accountId) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
};
