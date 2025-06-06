// DEPRECATED: This file is now a compatibility shim.
// The real ZSL engine is in zslang/engine/index.js

// ZSLang engine is being rebuilt. This module does not export runZSL.
// All ZSLang-related imports/exports are now disabled.
// This file is safe to keep as a placeholder for future ZSLang integration.

// ZSLang compiler engine compatibility shim for new engine
import { runZSL } from '../../zslang/engine/index.js';
export { runZSL };
