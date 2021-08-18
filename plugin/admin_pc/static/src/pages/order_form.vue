<template>
	<main id="service_order_form">
		<mm_warp>
			<mm_container>
				<mm_row>
					<mm_col class="col-mm-12">
						<mm_card>
							<div class="card_head arrow">
								<h5>{{ form[field] ? '修改' : '创建' }}订单信息</h5>
							</div>
							<div class="card_body">
								<mm_form>
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
											<control_select v-model="form.type_id" :options="$to_kv(list_type, 'type_id', 'name', 0)" />
										</dd>
										<dt>需求方用户</dt>
										<dd>
											<control_select v-model="form.demander_id" :options="$to_kv(list_account, 'user_id', 'nickname', 0)" />
										</dd>
										<dt class="required">联系电话</dt>
										<dd>
											<control_input v-model="form.demander_phone" :minlength="0" :maxlength="11" placeholder="下单者的电话"
											 :required="true" />
										</dd>
										<dt class="required">需求方姓名</dt>
										<dd>
											<control_input v-model="form.demander_name" :minlength="0" :maxlength="16" placeholder="下单者的姓名"
											 :required="true" />
										</dd>
										<dt>所属城市</dt>
										<dd>
											<control_select v-model="form.city_id" :options="$to_kv(list_address_city, 'city_id', 'name', 0)" />
										</dd>
										<dt>所属市区</dt>
										<dd>
											<control_select v-model="form.area_id" :options="$to_kv(list_address_area, 'area_id', 'name', 0)" />
										</dd>
										<dt>坐标位置X</dt>
										<dd>
											<control_number v-model="form.position_x" :min="0" :max="0" />
										</dd>
										<dt>坐标位置Y</dt>
										<dd>
											<control_number v-model="form.position_y" :min="0" :max="0" />
										</dd>
										<dt>价格</dt>
										<dd>
											<control_number v-model="form.price" :min="1" :max="1000000" />
										</dd>
										<dt>原价</dt>
										<dd>
											<control_number v-model="form.price_ago" :min="1" :max="1000000" />
										</dd>
										<dt>有效期至</dt>
										<dd>
											<mm_time v-model="form.time_validity" type="datetime-local" />
										</dd>
										<dt class="required">具体地址</dt>
										<dd>
											<control_input v-model="form.address" :minlength="0" :maxlength="255" placeholder=""
											 :required="true" />
										</dd>
										<dt>服务者电话</dt>
										<dd>
											<control_input v-model="form.phone" :minlength="0" :maxlength="11" placeholder="" />
										</dd>
										<dt>服务者姓名</dt>
										<dd>
											<control_input v-model="form.name" :minlength="0" :maxlength="16" placeholder="" />
										</dd>
										<dt>服务者</dt>
										<dd>
											<control_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname', 0)" />
										</dd>
										<dt>评分</dt>
										<dd>
											<control_number v-model="form.score" :min="0" :max="5" />
										</dd>
										<dt>头像地址</dt>
										<dd>
											<mm_upload_img width="10rem" height="10rem" name="avatar" type="text" v-model="form.avatar" />
										</dd>
										<dt>服务项</dt>
										<dd>
											<control_textarea v-model="form.items" type="text" placeholder="用于说明提供的服务项和价格"></control_textarea>
										</dd>
										<dt>正文</dt>
										<dd>
											<control_rich v-model="form.content"></control_rich>
										</dd>
									</dl>
								</mm_form>
							</div>
							<div class="card_foot">
								<div class="mm_group">
									<button class="btn_default" type="button" @click="cancel">取消</button>
									<button class="btn_primary" type="button" @click="submit()">提交</button>
								</div>
							</div>
						</mm_card>
					</mm_col>
				</mm_row>
			</mm_container>
		</mm_warp>
	</main>
</template>


<script>
	import mixin from '/src/mixins/page.js';

	export default {
		mixins: [mixin],
		components: {},
		data() {
			return {
				url_add: "/apis/service/order?method=add",
				url_set: "/apis/service/order?method=set",
				url_get_obj: "/apis/service/order?method=get_obj",
				field: "order_id",
				query: {
					"order_id": 0
				},
				form: {
					"order_id": 0,
					"state": 0,
					"way": 0,
					"type_id": 0,
					"demander_id": 0,
					"demander_phone": '',
					"demander_name": '',
					"city_id": 0,
					"area_id": 0,
					"position_x": 0,
					"position_y": 0,
					"price": 0,
					"price_ago": 0,
					"time_validity": '',
					"address": '',
					"phone": '',
					"name": '',
					"user_id": 0,
					"score": 0,
					"avatar": '',
					"items": '',
					"content": '',
				},
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
