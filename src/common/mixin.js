import Cookies from "js-cookie";
export const checkTableSelect = {
	data() {
		return {}
	},
	methods: {
		checkTableSelect(tableName, type = "multiple") {
			let row = this.$refs[tableName ? tableName : "baseTable"].selection;
			if (type == "single") {
				if (row.length !== 1) {
					this.$message.warning("请选择一项内容进行操作!");
					return false;
				}
			} else {
				if (row.length == 0) {
					this.$message.warning("请选择内容进行操作!");
					return false;
				}
			}
			return row;
		},
	}
}
export const showPopoverHandle = {
	data() {
		return {
			rows: []
		}
	},
	methods: {
		showPopoverHandle(popoverVisible, tableRef, type = "multiple") {
			this[popoverVisible] = false; //popover 默认显示值取反。判断是否勾选时，要先传false隐藏
			let rows = this.checkTableSelect(tableRef, type);
			if (!rows) return;
			this[popoverVisible] = true;
			this.rows = rows;
		},
	}
}

export const toEdit = {
	data() {
		return {
			rows: []
		}
	},
	methods: {
		toEdit(userId, id, type, text) {
			let isEditArticle = userId == Cookies.get("userId");
			let toRouter = () => {
				let routeUrl = this.$router.resolve({
					path: "/editor",
					query: {
						id,
						type
					},
				});
				window.open(routeUrl.href, "_blank");
			};
			if (!isEditArticle) {
				this.$confirm(`你不是改${text}的创建人，确定对该${text}进行编辑?`, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						toRouter();
					})
					.catch(() => {
						return;
					});
			} else {
				toRouter()
			}
		}
	}
}