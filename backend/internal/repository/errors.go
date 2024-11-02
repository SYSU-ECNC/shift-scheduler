package repository

import "errors"

var (
	ErrRecordNotFound   = errors.New("查询无结果")
	ErrUsernameConflict = errors.New("用户名已存在")
)
