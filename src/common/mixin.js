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