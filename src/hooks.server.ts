import { type HandleServerError, type Handle, redirect } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event, status }) => {
  console.error(`### hooks.server.ts: handleError triggered for ${event.url.pathname}`);
  console.error('### hooks.server.ts: RAW error object from SvelteKit:', error);
  console.error('### hooks.server.ts: RAW status from SvelteKit:', status);
  // --------------------------------------------------------

  let clientErrorMessage: string;
  let clientErrorCode: number = status || 500; // Pastikan status selalu ada

  // Pastikan `error` adalah objek dan memiliki `message` jika itu adalah SvelteKitError atau Error biasa
  if (error && typeof error === 'object' && 'message' in error && (error as any).message) {
    clientErrorMessage = (error as any).message;
  } else if (clientErrorCode === 404) {
    clientErrorMessage = 'Page not found';
  } else {
    clientErrorMessage = 'An unexpected error occurred.';
  }

  console.error('### hooks.server.ts: Returning error object to client:', {
    message: clientErrorMessage,
    status: clientErrorCode
  });
  // --------------------------------------------------------

  return {
    message: clientErrorMessage,
    status: clientErrorCode,
  };
};

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");
  
  const publicRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password'];

  const isPublicApi = event.url.pathname.startsWith("/api/auth");

  if (token) {
    // here u can fetch user data

    if(publicRoutes.includes(event.url.pathname)) {
      // If the user is authenticated and trying to access a public route,
      // redirect to home /
      throw redirect(303, '/');
    }

    event.locals.user = {
      username: "adam",
      email: "adam@mail.com"
    };
  } else {
    event.locals.user = null
    if (!publicRoutes.includes(event.url.pathname) && !isPublicApi) {
        throw redirect(303, '/signin');
    }
  }

  return resolve(event);
};