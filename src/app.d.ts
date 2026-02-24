import { db } from '$lib/db'
import type { Session } from '$lib/server/session';
import type { User } from '$lib/server/user';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            db: typeof db
            user: User | null;
            session: Session | null;
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
