// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Payload } from "payload";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			payload:Payload
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};