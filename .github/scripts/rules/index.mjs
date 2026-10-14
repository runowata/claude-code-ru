// Every rule the suite runs, in report order.
import * as internalLinks from './internal-links.mjs';
import * as anchorDiff from './anchor-diff.mjs';
import * as stubPaths from './stub-paths.mjs';
import * as stamps from './stamps.mjs';
import * as editionGate from './edition-gate.mjs';
import * as expiry from './expiry.mjs';
import * as images from './images.mjs';
import * as lessonLint from './lesson-lint.mjs';
import * as staticValidation from './static-validation.mjs';
import * as inertness from './inertness.mjs';
import * as smokeTests from './smoke-tests.mjs';
import * as lessonQuotes from './lesson-quotes.mjs';
import * as externalLinks from './external-links.mjs';
import * as drift from './drift.mjs';

// em-dash.mjs is left out: in the Russian translation the long dash is standard punctuation.
export const rules = [internalLinks, anchorDiff, stubPaths, stamps, editionGate, expiry, images, lessonLint, staticValidation, inertness, smokeTests, lessonQuotes, externalLinks, drift];
