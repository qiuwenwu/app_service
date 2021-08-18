// 集合路由、导航，不开发前端的情况下可以将以下2行注释掉
// const nav = $.nav_admin('{0}');
// nav.update();

/**
 * 接口主函数
 * @param {Object} ctx HTTP上下文
 * @param {Object} db 数据管理器,如: { next: async function{}, ret: {} }
 * @return {Object} 执行结果
 */
async function main(ctx, db) {
	console.log("订单接口");
	// 获取请求参数
	var req = ctx.request;
	var query = Object.assign({}, req.query);
	var body = Object.assign({}, req.body);
	var order_id = query.order_id;

	var user = ctx.session.user;
	var user_id = user.user_id;
	if (query.method === "add" && body.settlement) {
		body.remain_cash = 0;
		db.size = 0;
		db.table = "service_order";
		var orders = await db.get({
			user_id,
			state: 6
		});
		var total_quota = 0.00;
		orders.map((o) => {
			total_quota += o.price;
		})

		db.table = "service_balance";
		var balance = await db.groupSum({
			user_id
		}, 'state', 'settlement');
		var total_extract = 0.00;
		balance.map((o) => {
			if(o.state < 3){
				total_extract += o.sum_settlement;
			}
		});
		console.log(total_quota, total_extract, body.settlement);
		if (body.settlement > 0) {
			total_extract += Number(body.settlement);
		} else {
			return $.ret.error(70000, "非法操作!");
		}

		if (total_quota >= total_extract) {
			body.remain_cash = total_quota - total_extract;
			body.user_id = user_id;
		} else {
			return $.ret.error(10000, "账号余额不足。");
		}
	}
	var ret = await this.sql.run(query, body, db);
	return ret;
};

exports.main = main;
