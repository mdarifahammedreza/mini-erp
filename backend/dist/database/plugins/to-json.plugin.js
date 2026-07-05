"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSONPlugin = void 0;
const toJSONPlugin = (schema) => {
    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            if (ret._id) {
                ret.id = ret._id.toString();
                delete ret._id;
            }
            delete ret.__v;
            delete ret.password;
            delete ret.deletedAt;
            return ret;
        },
    });
};
exports.toJSONPlugin = toJSONPlugin;
//# sourceMappingURL=to-json.plugin.js.map