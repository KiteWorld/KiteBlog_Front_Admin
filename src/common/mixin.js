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