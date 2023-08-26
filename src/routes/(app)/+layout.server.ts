// import { redirect } from '@sveltejs/kit';

// import { jwtService } from '$lib/server/utils/context';

// export async function load({ cookies }) {
//   const jwt = cookies.get('jwt');
//   if (jwt) {
//     try {
//       return { sessionContext: await jwtService.verify(jwt) };
//     } catch (e) {
//       /* empty */
//     }
//   }

//   throw redirect(303, '/login');
// }
