"use strict";

module.exports = db => {
	let Transactions = db.define('transactions', {
		id: {
			type: "serial",
			size: 8,
			key: true,
			big: true,
			comment: "self increment id"
		},
		producer_block_id: {
			unique: "producer_trx_id",
			required: true,
			type: "text",
			size: 64,
			index: "p_b_t_id_index",
			comment: "block hash"
		},
		trx_id: {
			unique: "producer_trx_id",
			required: true,
			type: "text",
			size: 64,
			comment: "transaction hash"
		},
		rawData: {
			required: true,
			type: "object",
			big: true,
			comment: "raw data"
		},
		contract_action: {
			index: true,
			type: "text",
			size: 64,
			comment: "contract action"
		}
	}, {
		ACL: {
			"*": {
				"read": true
			}
		}
	});

	Transactions.hasOne('block', db.models.blocks, {
		key: true,
		reverse: "transactions"
	})

	return Transactions;
}