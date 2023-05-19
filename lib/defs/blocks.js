"use strict";

const util = require("util");
const blockCache = new util.LruCache(1000, 30 * 1000);

module.exports = db => {
	let Blocks = db.define('blocks', {
		id: {
			type: "serial",
			size: 8,
			key: true,
			big: true,
			comment: "self increment id"
		},
		block_num: {
			required: true,
			type: "integer",
			size: 8,
			index: true,
			comment: "block number"
		},
		block_time: {
			required: true,
			type: "date",
			time: true,
			comment: "block time"
		},
		producer_block_id: {
			unique: true,
			required: true,
			type: "text",
			size: 64,
			index: "p_b_id_index",
			comment: "block hash"
		},
		previous: {
			required: true,
			type: "text",
			size: 64,
			comment: "previous block hash"
		},
		producer: {
			required: true,
			type: "text",
			size: 12,
			comment: "block producer"
		},
		status: {
			required: true,
			type: "enum",
			values: ["irreversible", "pending", "lightconfirm"],
			default: "pending",
			index: true,
			comment: "block status"
		}
	});

	/**
	 * @returns {Number} return the final block number in the table, regardless of the status (pending or irreversible)
	 */
	Blocks.get_final_block = () => {
		let rs = Blocks.find({}).order("-block_num").limit(1).runSync();

		return rs.length === 1 ? rs[0].block_num : 0;
	}

	/**
	 * @returns {Number} return the final irreversible block number in the table
	 */
	Blocks.get_final_irreversible_block = () => {
		let rs = Blocks.find({ status: "irreversible" }).order("-block_num").limit(1).runSync();
		return rs.length === 1 ? rs[0].block_num : 0;
	}

	Blocks.get = (producer_block_id) => {
		return blockCache.get("blocks_" + producer_block_id, () => {
			return Blocks.oneSync({
				producer_block_id: producer_block_id
			});
		});
	}

	return Blocks;
};