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
	// 获取请求参数
	var req = ctx.request;
	var query = Object.assign({}, req.query);
	var body = Object.assign({}, req.body);

	var mode = query.mode;
	delete query.mode;

	var date = new Date();
	var now = date.toStr("yyyy-MM-dd 00:00:00");
	var last = date.addDays(-30).toStr("yyyy-MM-dd 00:00:00");
	
	db.size = 10000;
	delete query.mode;
	switch (mode) {
		case "achievement":
			query = {
				method: "count",
				groupby: "user_id",
				field: "order_id",
				state: 6,
				time_create_min: last,
				time_create_max: now,
				orderby: "count_order_id desc"
			}
			break;
		case "score":
			query = {
				method: "avg",
				groupby: "user_id",
				field: "score",
				state: 6,
				time_create_min: last,
				time_create_max: now,
				orderby: "avg_score desc"
			}
			break;
		case "new":
			db.table = "service_member";
			var users = await db.get({
				time_create_min: last,
				time_create_max: now
			});
			var arr = users.map((o) => {
				return o.user_id;
			});
			var user_id = arr.join('|');
			var db2 = Object.assign({}, db);

			query = {
				method: "count",
				groupby: "user_id",
				field: "order_id",
				state: 6,
				time_create_min: last,
				time_create_max: now,
				orderby: "count_order_id desc",
				user_id
			}
			break;
	}
	var ret = await this.sql.run(query, body, db);
	if (ret && ret.result) {
		var list = ret.result.list;
		var arr = list.map((o) => {
			return o.user_id;
		});
		var ids = arr.join(',');
		var sql = "SELECT `member_id`,`user_id`,`name`,`avatar` FROM `service_member` WHERE `user_id` IN (" + ids + ");";
		var users = await db.run(sql);

		ret.result.list = list.map((o) => {
			for (var i = 0; i < users.length; i++) {
				var obj = users[i];
				if (o.user_id == obj.user_id) {
					o = Object.assign(o, obj);
					break;
				}
			}
			return o;
		});
	}
	return ret;
};

exports.main = main;
