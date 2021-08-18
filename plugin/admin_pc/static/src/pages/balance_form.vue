<template>
	<main id="service_balance_form">
		<mm_warp>
			<mm_container>
				<mm_row>
					<mm_col class="col-mm-12">
						<mm_card>
							<div class="card_head arrow">
								<h5>{{ form[field] ? '修改' : '创建' }}结算</h5>
							</div>
							<div class="card_body">
								<mm_form>
									<dl>
										<dt>账户余额</dt>
										<dd>
											<control_number v-model="form.remain_cash" :min="0" :max="0" />
										</dd>
										<dt>结款金额</dt>
										<dd>
											<control_number v-model="form.settlement" :min="0" :max="0" />
										</dd>
										<dt>状态</dt>
										<dd>
											<control_select v-model="form.state" :options="$to_kv(arr_state)" />
										</dd>
										<dt>结款人</dt>
										<dd>
											<control_select v-model="form.user_id" :options="$to_kv(list_account, 'user_id', 'nickname', 0)" />
										</dd>
										<dt>备注</dt>
										<dd>
											<control_textarea v-model="form.desc" type="text" placeholder="强制取消的理由"></control_textarea>
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
				url_add: "/apis/service/balance?method=add",
				url_set: "/apis/service/balance?method=set",
				url_get_obj: "/apis/service/balance?method=get_obj",
				field: "account_id",
				query: {
					"account_id": 0
				},
				form: {
					"account_id": 0,
					"remain_cash": 0,
					"settlement": 0,
					"state": 0,
					"user_id": 0,
					"desc": '',
				},
				// 状态
				'arr_state':["","申请中","已提取","已取消"],
				// 结款人
				'list_account':[],
			}
		},
		methods: {
			/**
			 * 获取结款人
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
			// 获取结款人
			this.get_account();
		}
	}
</script>

<style>
</style>
