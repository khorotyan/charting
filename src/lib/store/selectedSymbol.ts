import { writable } from 'svelte/store';
import type { Symbol } from '../models/symbol';

export const selectedSymbol = writable<Symbol | null>(null);
