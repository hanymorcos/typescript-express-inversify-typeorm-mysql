#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var SchemaSyncCommand_1 = require("./commands/SchemaSyncCommand");
var SchemaDropCommand_1 = require("./commands/SchemaDropCommand");
var QueryCommand_1 = require("./commands/QueryCommand");
var EntityCreateCommand_1 = require("./commands/EntityCreateCommand");
var MigrationCreateCommand_1 = require("./commands/MigrationCreateCommand");
var MigrationRunCommand_1 = require("./commands/MigrationRunCommand");
var MigrationRevertCommand_1 = require("./commands/MigrationRevertCommand");
var SubscriberCreateCommand_1 = require("./commands/SubscriberCreateCommand");
require("yargonaut")
    .style("blue")
    .style("yellow", "required")
    .helpStyle("green")
    .errorsStyle("red");
require("yargs")
    .usage("Usage: $0 <command> [options]")
    .command(new SchemaSyncCommand_1.SchemaSyncCommand())
    .command(new SchemaDropCommand_1.SchemaDropCommand())
    .command(new QueryCommand_1.QueryCommand())
    .command(new EntityCreateCommand_1.EntityCreateCommand())
    .command(new SubscriberCreateCommand_1.SubscriberCreateCommand())
    .command(new MigrationCreateCommand_1.MigrationCreateCommand())
    .command(new MigrationRunCommand_1.MigrationRunCommand())
    .command(new MigrationRevertCommand_1.MigrationRevertCommand())
    .demand(1)
    .version(function () { return require("./package.json").version; })
    .alias("v", "version")
    .help("h")
    .alias("h", "help")
    .argv;

//# sourceMappingURL=cli.js.map
