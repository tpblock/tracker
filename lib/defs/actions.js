"use strict";

module.exports = db => {
    let Actions = db.define('actions', {
        id: {
            type: "serial",
            size: 8,
            key: true,
            big: true,
            comment: "self increment id"
        },
        global_sequence: {
            index: "trx_global_index",
            required: true,
            type: "text",
            size: 64,
            comment: "global sequence"
        },
        trx_id: {
            index: "trx_global_index",
            required: true,
            type: "text",
            size: 64,
            comment: "transaction hash"
        },
        contract_action: {
            required: true,
            type: "text",
            size: 64,
            comment: "contract action"
        },
        rawData: {
            required: true,
            type: "object",
            big: true,
            comment: "raw data"
        }
    });

    Actions.hasOne('parent', Actions, {
        key: true,
        reverse: "inline_action"
    });

    Actions.hasOne('transaction', db.models.transactions, {
        key: true,
        reverse: "actions"
    });

    return Actions;
}