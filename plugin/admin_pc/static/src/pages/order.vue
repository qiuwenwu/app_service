<template>
	<main id="service_order">
		<mm_warp>
			<mm_container>
				<mm_row>
					<mm_col class="col-12">
						<mm_card>
							<div class="card_head arrow">
								<h5>订单信息</h5>
							</div>
							<div class="card_body">
								<mm_form class="bar_filter">
									<div class="title">
										<h5><span>筛选条件</span></h5>
									</div>
									<mm_list :col="3">
										<mm_item>
											<control_input v-model="query.keyword" title="关键词" desc="需求方姓名 / 服务者姓名 / 正文"
											 @blur="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.state" title="状态" :options="$to_kv(arr_state)" @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.way" title="收费方式" :options="$to_kv(arr_way)" @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.type_id" title="服务分类" :options="$to_kv(list_type, 'type_id', 'name')"
											 @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.demander_id" title="需求方用户" :options="$to_kv(list_account, 'user_id', 'nickname')"
											 @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.city_id" title="所属城市" :options="$to_kv(list_address_city, 'city_id', 'name')"
											 @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.area_id" title="所属市区" :options="$to_kv(list_address_area, 'area_id', 'name')"
											 @change="search()" />
										</mm_item>
										<mm_item>
											<control_select v-model="query.user_id" title="服务者" :options="$to_kv(list_account, 'user_id', 'nickname')"
											 @change="search()" />
										</mm_item>
										<mm_item>
											<mm_btn class="btn_primary-x" type="reset" @click.native="reset();search()">重置</mm_btn>
										</mm_item>
									</mm_list>
								</mm_form>
								<div class="bar_action">
									<h5><span>操作</span></h5>
									<div class="btns">
										<mm_btn class="btn_primary-x" url="./order_form?">添加</mm_btn>
										<mm_btn @click.native="show = true" class="btn_primary-x" v-bind:class="{ 'disabled': !selects }">批量修改</mm_btn>
									</div>
									<div class="btn_small">
										<control_file class="btn_default-x" type="excel" :func="import_db" v-if="url_import"></control_file>
										<mm_btn class="btn_default-x" @click.native="export_db()" v-if="url_export">导出</mm_btn>
									</div>
								</div>
								<mm_table type="2">
									<thead class="table-sm">
										<tr>
											<th class="th_selected"><input type="checkbox" :checked="select_state" @click="select_all()" /></th>
											<th class="th_id"><span>#</span></th>
											<th>
												<control_reverse title="状态" v-model="query.orderby" field="state" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="收费方式" v-model="query.orderby" field="way" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="服务分类" v-model="query.orderby" field="type_id" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="需求方用户" v-model="query.orderby" field="demander_id" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="联系电话" v-model="query.orderby" field="demander_phone" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="需求方姓名" v-model="query.orderby" field="demander_name" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="所属城市" v-model="query.orderby" field="city_id" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="所属市区" v-model="query.orderby" field="area_id" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="坐标位置X" v-model="query.orderby" field="position_x" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="坐标位置Y" v-model="query.orderby" field="position_y" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="价格" v-model="query.orderby" field="price" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="原价" v-model="query.orderby" field="price_ago" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="有效期至" v-model="query.orderby" field="time_validity" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="创建时间" v-model="query.orderby" field="time_create" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="更新时间" v-model="query.orderby" field="time_update" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="具体地址" v-model="query.orderby" field="address" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="服务者电话" v-model="query.orderby" field="phone" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="服务者姓名" v-model="query.orderby" field="name" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="服务者" v-model="query.orderby" field="user_id" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="评分" v-model="query.orderby" field="score" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="头像地址" v-model="query.orderby" field="avatar" :func="search"></control_reverse>
											</th>
											<th>
												<control_reverse title="服务项" v-model="query.orderby" field="items" :func="search"></control_reverse>
											</th>
											<th class="th_handle"><span>操作</span></th>
										</tr>
									</thead>
									<tbody>
										<!-- <draggable v-model="list" tag="tbody" @change="sort_change"> -->
										<tr v-for="(o, idx) in list" :key="idx" :class="{'active': select == idx}" @click="selected(idx)">
											<th class="th_selected"><input type="checkbox" :checked="select_has(o[field])" @click="select_change(o[field])" /></th>
											<td>{{ o[field] }}</td>
											<td>
												<span v-bind:class="arr_color[o.state]">{{arr_state[o.state] }}</span>
											</td>
											<td>
												<span>{{arr_way[o.way] }}</span>
											</td>
											<td>
												<span>{{ $get_name(list_type, o.type_id, 'type_id', 'name') }}</span>
											</td>
											<td>
												<span>{{ $get_name(list_account, o.demander_id, 'user_id', 'nickname') }}</span>
											</td>
											<td>
												<span>{{ o.demander_phone }}</span>
											</td>
											<td>
												<span>{{ o.demander_name }}</span>
											</td>
											<td>
												<span>{{ $get_name(list_address_city, o.city_id, 'city_id', 'name') }}</span>
											</td>
											<td>
												<span>{{ $get_name(list_address_area, o.area_id, 'area_id', 'name') }}</span>
											</td>
											<td>
												<span>{{ o.position_x }}</span>
											</td>
											<td>
												<span>{{ o.position_y }}</span>
											</td>
											<td>
												<span>{{ o.price }}</span>
											</td>
											<td>
												<span>{{ o.price_ago }}</span>
											</td>
											<td>
												<span>{{ $to_time(o.time_validity, 'yyyy-MM-dd hh:mm') }}</span>
											</td>
											<td>
												<span>{{ $to_time(o.time_create, 'yyyy-MM-dd hh:mm') }}</span>
											</td>
											<td>
												<span>{{ $to_time(o.time_update, 'yyyy-MM-dd hh:mm') }}</span>
											</td>
											<td>
												<span>{{ o.address }}</span>
											</td>
											<td>
												<span>{{ o.phone }}</span>
											</td>
											<td>
												<span>{{ o.name }}</span>
											</td>
											<td>
												<span>{{ $get_name(list_account, o.user_id, 'user_id', 'nickname') }}</span>
											</td>
											<td>
												<span>{{ o.score }}</span>
											</td>
											<td>
												<img class="avatar" :src="o.avatar" alt="头像地址" />
											</td>
											<td>
												<span>{{ o.items }}</span>
											</td>
											<td>
												<mm_btn class="btn_primary" :url="'./order_form?order_id=' + o[field]">修改</mm_btn>
												<mm_btn class="btn_warning" @click.native="del_show(o, field)">删除</mm_btn>
											</td>
										</tr>
									</tbody>
									<!-- </draggable> -->
								</mm_table>
							</div>
							<div class="card_foot">
								<div class="fl">
									<control_select v-model="query.size" :options="$to_size()" @change="search()" />
								</div>
								<div class="fr">
									<span class="mr">共 {{ count }} 条</span>
									<span>当前</span>
									<input type="number" class="pager_now" v-model.number="page_now" @blur="goTo(page_now)" @change="page_change" />
									<span>/{{ page_count }}页</span>
								</div>
								<control_pager display="2" v-model="query.page" :count="count / query.size" :func="goTo" :icons="['首页', '上一页', '下一页', '尾页']"></control_pager>
							</div>
						</mm_card>
					</mm_col>
				</mm_row>
			</mm_container>
		</mm_warp>
		<mm_modal v-model="show" mask="true">
			<mm_card class="card">
				<div class="card_head">
					<h5>批量修改</h5>
				</div>
				<div class="card_body pa">
					<dl>
						<dt>状态</dt>
						<dd>
							<control_select v-model="form.state" :options="$to_kv(arr_state)" />
						</dd>
						<dt>收费方式</dt>
						<dd>
							<control_select v-model="form.way" :options="$to_kv(arr_way)" />
						</dd>
						<dt>服务分类</dt>
						<dd>
							<control_select v-model="form.type_id" :options="$to_kv(list_type, 'type_id', 'name')" />
						</dd>
						<dt>需求方用户</dt>
						<dd>
							<control_select v-model="form.demander_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
						</dd>
						<dt>所属城市</dt>
						<dd>
							<control_select v-model="form.city_id" :options="$to_kv(list_address_city, 'city_id', 'name')" />
						</dd>
						<dt>所属市区</dt>
						<dd>
							<control_select v-model="form.area_id" :options="$to_kv(list_address_area, 'area_id', 'name')" />
						</dd>
						<dt>服务者</dt>
						<dd>
							<control_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname')" />
						</dd>
					</dl>
				</div>
				<div class="card_foot">
					<div class="mm_group">
						<button class="btn_default" type="reset" @click="show = false">取消</button>
						<button class="btn_primary" type="button" @click="batchSet()">提交</button>
					</div>
				</div>
			</mm_card>
		</mm_modal>
	</main>
</template>

<script>
	import mixin from '/src/mixins/page.js';

	export default {
		mixins: [mixin],
		data() {
			return {
				// 列表请求地址
				url_get_list: "/apis/service/order",
				url_del: "/apis/service/order?method=del&",
				url_set: "/apis/service/order?method=set&",
				url_import: "/apis/service/order?method=import&",
				url_export: "/apis/service/order?method=export&",
				field: "order_id",
				query_set: {
					"order_id": ""
				},
				// 查询条件
				query: {
					//页码
					page: 1,
					//页面大小
					size: 10,
					// 订单id
					'order_id': 0,
					// 状态——最小值
					'state_min': '',
					// 状态——最大值
					'state_max': '',
					// 收费方式——最小值
					'way_min': '',
					// 收费方式——最大值
					'way_max': '',
					// 服务分类ID
					'type_id': '',
					// 需求方用户ID
					'demander_id': '',
					// 需求方姓名
					'demander_name': '',
					// 所属城市ID
					'city_id': '',
					// 所属市区ID
					'area_id': '',
					// 坐标位置X——最小值
					'position_x_min': 0,
					// 坐标位置X——最大值
					'position_x_max': 0,
					// 坐标位置Y——最小值
					'position_y_min': 0,
					// 坐标位置Y——最大值
					'position_y_max': 0,
					// 价格——最小值
					'price_min': 0,
					// 价格——最大值
					'price_max': 0,
					// 原价——最小值
					'price_ago_min': 0,
					// 原价——最大值
					'price_ago_max': 0,
					// 有效期至——开始时间
					'time_validity_min': '',
					// 有效期至——结束时间
					'time_validity_max': '',
					// 创建时间——开始时间
					'time_create_min': '',
					// 创建时间——结束时间
					'time_create_max': '',
					// 更新时间——开始时间
					'time_update_min': '',
					// 更新时间——结束时间
					'time_update_max': '',
					// 服务者姓名
					'name': '',
					// 服务者ID
					'user_id': '',
					// 评分——最小值
					'score_min': 0,
					// 评分——最大值
					'score_max': 0,
					// 正文
					'content': '',
					// 关键词
					'keyword': '',
					//排序
					orderby: ""
				},
				form: {},
				//颜色
				arr_color: ['', '', 'font_yellow', 'font_success', 'font_warning', 'font_primary', 'font_info', 'font_default'],
				// 状态
				'arr_state':["","待接单","待上门","待开工","已取消","工作中","已完成"],
				// 收费方式
				'arr_way':["","次","时","日","周","月","季","年"],
				// 服务分类
				'list_type':[],
				// 需求方用户
				'list_account':[],
				// 所属城市
				'list_address_city':[],
				// 所属市区
				'list_address_area':[],
				// 服务者
				'list_account':[],
				// 视图模型
				vm: {}
			}
		},
		methods: {
			/**
			 * 获取服务分类
			 * @param {query} 查询条件
			 */
			get_type(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "type_id,name"
					};
				}
				this.$get('~/apis/service/type?size=0', query, function(json) {
					if (json.result) {
						_this.list_type.clear();
						_this.list_type.addList(json.result.list)
					}
				});
			},
			/**
			 * 获取需求方用户
			 * @param {query} 查询条件
			 */
			get_account(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "user_id,nickname"
					};
				}
				this.$get('~/apis/user/account?size=0', query, function(json) {
					if (json.result) {
						_this.list_account.clear();
						_this.list_account.addList(json.result.list)
					}
				});
			},
			/**
			 * 获取所属城市
			 * @param {query} 查询条件
			 */
			get_address_city(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "city_id,name"
					};
				}
				this.$get('~/apis/sys/address_city?size=0', query, function(json) {
					if (json.result) {
						_this.list_address_city.clear();
						_this.list_address_city.addList(json.result.list)
					}
				});
			},
			/**
			 * 获取所属市区
			 * @param {query} 查询条件
			 */
			get_address_area(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "area_id,name"
					};
				}
				this.$get('~/apis/sys/address_area?size=0', query, function(json) {
					if (json.result) {
						_this.list_address_area.clear();
						_this.list_address_area.addList(json.result.list)
					}
				});
			},
			/**
			 * 获取服务者
			 * @param {query} 查询条件
			 */
			get_account(query) {
				var _this = this;
				if (!query) {
					query = {
						field: "user_id,nickname"
					};
				}
				this.$get('~/apis/user/account?size=0', query, function(json) {
					if (json.result) {
						_this.list_account.clear();
						_this.list_account.addList(json.result.list)
					}
				});
			},
		},
		created() {
			// 获取服务分类
			this.get_type();
			// 获取需求方用户
			this.get_account();
			// 获取所属城市
			this.get_address_city();
			// 获取所属市区
			this.get_address_area();
			// 获取服务者
			this.get_account();
		}
	}
</script>

<style>
</style>
