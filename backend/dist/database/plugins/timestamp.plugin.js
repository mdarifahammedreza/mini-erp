"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestampPlugin = void 0;
const timestampPlugin = (schema) => {
    schema.set('timestamps', { createdAt: 'createdAt', updatedAt: 'updatedAt' });
};
exports.timestampPlugin = timestampPlugin;
//# sourceMappingURL=timestamp.plugin.js.map