import { AuthenticatedUser } from '@/types/auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const IframeJWTProvider = CredentialsProvider({
  id: 'iframe-jwt',
  name: 'Iframe JWT',
  credentials: {
    token: { label: 'Token', type: 'text' },
    userId: { label: 'User ID', type: 'text' },
    email: { label: 'Email', type: 'email' },
  },
  async authorize(credentials) {
    if (!credentials?.token || !credentials?.userId) return null;

    const { token, userId, email } = credentials;

    try {
      // Step 1: Fetch user's accounts using token & userId
      let accounts: any[] = [];
      try {
        const accountRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/clientaccounts/GetUserAccountsByUserId?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
          console.warn('Failed to fetch accounts:', await accountRes.text());
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }

      // Step 2: Fetch roles for first account
      let roles: any[] = [];
      const firstAccountId = accounts.length > 0 ? accounts[0].Id : null;
      const accountUserName = accounts.length > 0 ? accounts[0].Name : '';

      if (firstAccountId) {
        try {
          const rolesRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Roles/GetByUserIdAccountId?userId=${userId}&accountId=${firstAccountId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            }
          );

          if (rolesRes.ok) roles = await rolesRes.json();
          else console.warn('Failed to fetch roles:', await rolesRes.text());
        } catch (err) {
          console.error('Error fetching roles:', err);
        }
      }

      // Step 3: Return user object
      const user: AuthenticatedUser = {
        id: userId,
        email: email,
        name: accountUserName,
        accessToken: token,
        tokenType: 'Bearer',
        expiresIn: 900, // unknown
        issued: new Date().toISOString(),
        expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        accountId: firstAccountId,
        roles,
      };
      return user;
    } catch (err) {
      console.error('Iframe JWT authorization error:', err);
      return null;
    }
  },
});
