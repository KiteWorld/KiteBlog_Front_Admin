export const USER_STATUS = {
	"0": "正常",
	"1": "轻微违规",
	"2": "严重违规",
	"3": "封号"
}
export const USER_STATUS_TAG_TYPE = {
	"0": "success",
	"1": "warning",
	"2": "danger",
	"3": "info"
}
export const TOC_USER_ROLE = {
	"normal": "普通用户",
	"VIP": "VIP",
	"SVIP": "SVIP",
	"tocms": "后台关联用户",
}
export const CMS_USER_ROLE = {
	"superadmin": "超级管理员",
	"admin": "管理员",
	"auditor": "审核员",
	"editor": "编辑",
	"visitor": "看客"
}

export const USER_SEX = {
	"0": "未知",
	"1": "男",
	"2": "女",
}

export const APPROVE_STATUS = {
	"pendSubmit": "待提交",
	"pending": "待审核",
	"audited": "已审核",
	"rejected": "已驳回"
}

export const HOTPOINT_STATUS = {
	"normal": "普通",
	"remove": "移除",
}

export const ARTICLE_RECOMMEND_TYPE = {
	"normal": "普通",
	"recommend": "推荐",
	"hot": "热门",
	"top": "置顶"
}
export const ARTICLE_INIT_PARAMS = {
	title: null,
	content: null,
	markdown: null,
	categoryId: null,
	userId: null,
	type: null,
	status: null,
	id: null,
}
export const HOTPOINT_INIT_PARAMS = {
	hotPointContent: null,
	hotPointType: null,
	hotPointStatus: null,
	categoryId: null,
	userId: null,
	hotPointId: null,
}