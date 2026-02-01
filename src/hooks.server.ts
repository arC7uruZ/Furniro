import { db } from '$lib/db';

export async function handle({ event, resolve }) {
  event.locals.db = db;

  return resolve(event);
}
