import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/login',
  '/create-incident',
  '/how-fixit-fast-works',
  '/iframe',
];

export default withAuth(
  function middleware(req) {
    const { nextUrl, cookies } = req;
    const roleId = cookies.get('fifRoleId')?.value;
    const roleName = cookies.get('fifRoleName')?.value;
    const currentRoute = nextUrl.pathname;
    const token: any = req.nextauth.token;

    // If no role cookie, handle automatic or multi-role redirect
    if (!roleId || !roleName) {
      const roles = token?.roles || [];

      // Case 1: User has exactly one role
      if (roles.length === 1) {
        const singleRole = roles[0];

        // Prepare redirect based on role
        const redirectTo =
          singleRole?.Name === 'Account Administrator'
            ? '/admin'
            : singleRole?.Name === 'Evaluator'
            ? '/evaluator'
            : singleRole?.Name === 'Operator'
            ? '/operator'
            : singleRole?.Name === 'Initiator'
            ? '/'
            : '/';

        // Create a response that sets cookies
        const res = NextResponse.redirect(new URL(redirectTo, req.url));

        // Set cookies for roleId and roleName
        res.cookies.set('fifRoleId', singleRole?.Id, {
          path: '/',
          maxAge: 60 * 15, // 15 minutes
        });
        res.cookies.set('fifRoleName', singleRole?.Name, {
          path: '/',
          maxAge: 60 * 15, // 15 minutes
        });

        return res;
      }

      // Case 2: Multiple roles → redirect to /role-select
      if (roles.length > 1 && currentRoute !== '/role-select') {
        const roleSelectUrl = nextUrl.clone();
        roleSelectUrl.pathname = '/role-select';
        return NextResponse.redirect(roleSelectUrl);
      }
    }

    // Role-based route restrictions
    if (
      roleName === 'Initiator' &&
      (currentRoute.startsWith('/evaluator') ||
        currentRoute.startsWith('/operator'))
    ) {
      const homeUrl = nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }

    if (
      roleName === 'Evaluator' &&
      (currentRoute.startsWith('/operator') ||
        currentRoute.startsWith('/initiator') ||
        currentRoute === '/')
    ) {
      const homeUrl = nextUrl.clone();
      homeUrl.pathname = '/evaluator';
      return NextResponse.redirect(homeUrl);
    }

    if (
      roleName === 'Operator' &&
      (currentRoute.startsWith('/evaluator') ||
        currentRoute.startsWith('/initiator') ||
        currentRoute === '/')
    ) {
      const homeUrl = nextUrl.clone();
      homeUrl.pathname = '/operator';
      return NextResponse.redirect(homeUrl);
    }

    if (
      roleName === 'Account Administrator' &&
      (currentRoute.startsWith('/operator') ||
        currentRoute.startsWith('/initiator') ||
        currentRoute.startsWith('/evaluator') ||
        currentRoute === '/')
    ) {
      const homeUrl = nextUrl.clone();
      homeUrl.pathname = '/admin';
      return NextResponse.redirect(homeUrl);
    }

    // Public routes should always pass through
    if (publicRoutes.includes(currentRoute)) {
      return NextResponse.next();
    }

    // Default: Allow normal access
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const currentRoute = req.nextUrl.pathname;
        if (publicRoutes.includes(currentRoute)) {
          return true;
        } else {
          return !!token;
        }
      },
    },
    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/login',
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
