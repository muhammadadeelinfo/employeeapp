"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMapsSearchUrl = void 0;
const buildMapsSearchUrl = (address) => {
    const normalizedAddress = address?.trim();
    if (!normalizedAddress)
        return undefined;
    const query = encodeURIComponent(normalizedAddress);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
};
exports.buildMapsSearchUrl = buildMapsSearchUrl;
