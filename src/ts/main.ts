// Client-side entry point. Progressive enhancement only: every page must work
// with this file absent.
import { initCalendly } from "./calendly";
import { initScrollEffects } from "./scroll-effects";
import { initPawPattern } from "./paw-pattern";

initCalendly();
initScrollEffects();
initPawPattern();
