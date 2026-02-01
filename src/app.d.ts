import { db } from '$lib/db'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            db: typeof db
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
