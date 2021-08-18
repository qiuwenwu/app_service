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
	// console.log("订单接口");
	// 获取请求参数
	var req = ctx.request;
	var query = Object.assign({}, req.query);
	var body = Object.assign({}, req.body);
	var order_id = query.order_id;

	var user = ctx.session.user;
	var user_id = user.user_id;

	db.table = "user_info";
	var info = await db.getObj({
		user_id
	});
	user = Object.assign({}, user, info);

	if (!query.method || query.method === "get" || query.method === "get_obj") {
		// console.log("进入");
		if (!query.user_id && !query.demander_id) {
			return $.ret.error(70000, "user_id或者demander_id必须传一个！");
		}
		// console.log(user_id,query.demander_id,query.user_id);
		if ((query.demander_id && query.demander_id == user_id) || (query.user_id && query.user_id == user_id)) {
			// console.log("判断成功");
		} else {
			return $.ret.error(70000, "非法操作！");
		}
	} else if (query.method === "add") {
		body.demander_id = user_id;
		if (body.demander_id == body.user_id) {
			return $.ret.error(80000, "您不能给自己下单！");
		}
		body.demander_name = body.demander_name || user.name;
		body.demander_phone = body.demander_phone || user.phone;
	} else if (query.method === "set") {
		db.table = "service_order";
		var order = await db.getObj({
			"demander_id": user_id,
			order_id
		});
		if (!order) {
			order = await db.getObj({
				user_id,
				order_id
			});
			if (!order) {
				return $.ret.error(70000, "非法操作！");
			}
		}
	}
	var ret = await this.sql.run(query, body, db);
	return ret;
};

exports.main = main;
