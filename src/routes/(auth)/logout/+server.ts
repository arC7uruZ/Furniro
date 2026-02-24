// src/routes/logout/+server.js
import { deleteSession, deleteSessionTokenCookie } from '$lib/server/session.js';
import { json, redirect } from '@sveltejs/kit';

export const POST = async (event) => {
    // 1. Limpe o cookie de sessão
    // cookies.delete('session_id', { path: '/' });

    // 2. Limpe o locals (opcional, mas boa prática)
    // locals.user = null;

    // 3. Redirecione para a home ou login
    // console.log("xibiu")


    if (event.locals.session !== null && event.locals.user !== null) {
        await deleteSession(event.locals.session.id);
        deleteSessionTokenCookie(event);
        event.locals.session = null;
        event.locals.user = null;
    }

    return json({"success": true});
};