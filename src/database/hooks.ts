import type { Schema } from "mongoose";
import { GlobalHash } from "../common/utils/security/hash.js";

export function hashUserPassword(schema: Schema) {
  schema.pre("save", function (this) {
    if (this.password) this.password = GlobalHash(this.password as string);
  });
}

export function paranoidFunction(schema: Schema) {
  schema.pre(["find", "findOne"], function (this) {
    const query = this.getQuery();
    if (query?.paranoid) {
      this.setQuery({ ...query, deletedAt: { $exists: true } });
    } else {
      this.setQuery({ ...query, deletedAt: null });
    }
  });
}
