erp-backend   | Node.js v20.20.2
erp-backend exited with code 1 (restarting)
erp-backend   | /app/node_modules/mongoose/lib/schema.js:2649
erp-backend   |     throw new MongooseError('Virtual path "' + name + '"' +
erp-backend   |     ^tach
erp-backend   | 
erp-backend   | MongooseError: Virtual path "id" conflicts with a real path in the schema
erp-backend   |     at Schema.virtual (/app/node_modules/mongoose/lib/schema.js:2649:11)
erp-backend   |     at Object.<anonymous> (/app/dist/modules/products/schemas/product.schema.js:74:23)
erp-backend   |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
erp-backend   |     at Module._extensions..js (node:internal/modules/cjs/loader:1623:10)
erp-backend   |     at Module.load (node:internal/modules/cjs/loader:1266:32)
erp-backend   |     at Module._load (node:internal/modules/cjs/loader:1091:12)
erp-backend   |     at Module.require (node:internal/modules/cjs/loader:1289:19)
erp-backend   |     at require (node:internal/modules/helpers:182:18)
erp-backend   |     at Object.<anonymous> (/app/dist/database/seeders/seeder.module.js:16:26)
erp-backend   |     at Module._compile (node:internal/modules/cjs/loader:1521:14)
erp-backend   | 
erp-backend   | Node.js v20.20.2
erp-backend exited with code 1 (restarting)