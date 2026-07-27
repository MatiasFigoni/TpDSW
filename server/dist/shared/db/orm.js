import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'CyberDB',
    driver: MySqlDriver,
    clientUrl: 'mysql://dsw:dsw@localhost:3306/CyberDB',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
        //never in production: Solo usar para desarrollo.
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    // await orm.schema.updateSchema()
    /*
    await generator.dropSchema();
    await generator.createSchema();
    */
};
//# sourceMappingURL=orm.js.map