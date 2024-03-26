"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegexCharacters = void 0;
function escapeRegexCharacters(str) {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}
exports.escapeRegexCharacters = escapeRegexCharacters;
