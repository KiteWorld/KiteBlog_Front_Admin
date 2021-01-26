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

export const jobNo = [{
	required: true,
	message: "请选择性别",
	trigger: "blur",
}, {
	min: 6,
	max: 16,
	message: "长度在 6 到 16 个字符",
	trigger: "blur",
}, ]

export const email = [{
		required: true,
		message: '请输入邮箱地址',
		trigger: 'blur'
	},
	{
		type: 'email',
		message: '请输入正确的邮箱地址',
		trigger: ['blur', 'change']
	}
]

export const phone = [{
	required: true,
	message: '请输入手机号码',
	trigger: 'blur'
}, {
	validator: function (rule, value, callback) {
		if (!value) {
			callback()
		}
		if (!/^1\d{10}$/.test(value)) {
			callback(new Error('手机号格式错误'))
		} else {
			callback()
		}
	},
	trigger: ['blur', 'change']
}]

//
export const change = (msg) => {
	return [{
		required: true,
		message: msg,
		trigger: "change",
	}]
}

//
export const isNoEmpty = (msg) => {
	return [{
		required: true,
		message: msg,
		trigger: "blur",
	}]
}



export const isNumLetter = (msg) => {
	return [{
		required: true,
		validator: (rule, value, callback) => {
			if (!value) {
				callback(new Error(msg));
			} else if (!/^[A-Za-z0-9-_]+$/.test(value)) {
				callback(new Error('只支持下划线、减号、数字和英文字母'));
			} else {
				callback();
			}
		},
		trigger: ['blur', 'change']
	}]
}

//检验数组是否有值
export const arrChange = (msg) => {
	return [{
		type: 'array',
		required: true,
		message: msg,
		trigger: 'change'
	}]
}


export const externalLink = [{
	required: true,
	validator: (rule, value, callback) => {
		if (value === '') {
			callback(new Error('请填写外链地址'));
		} else if (!/^(https?:|mailto:|tel:)/.test(value)) {
			callback(new Error('请输入正确地址'));
		} else {
			callback();
		}
	},
	trigger: ['blur', 'change']
}]