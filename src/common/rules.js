export const userName = [{
		required: true,
		message: "请输入用户名",
		trigger: "blur"
	},
	{
		min: 6,
		max: 16,
		message: "长度在 1 到 16 个字符",
		trigger: "blur",
	},
]

export const password = [{
		required: true,
		message: "请输入密码",
		trigger: "blur"
	},
	{
		min: 6,
		max: 16,
		message: "长度在 6 到 16 个字符",
		trigger: "blur",
	},
]

export const userRole = [{
	required: true,
	message: "请选择用户对应的角色",
	trigger: "change",
}]

export const userStatus = [{
	required: true,
	message: "请选择状态",
	trigger: "change",
}]
export const userSex = [{
	required: true,
	message: "请选择性别",
	trigger: "change",
}]