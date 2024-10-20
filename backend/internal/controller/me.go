package controller

import "net/http"

func (ctrl *Controller) getRequesterInfo(w http.ResponseWriter, r *http.Request) {
	requester, err := ctrl.getRequesterFromCtx(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.ok(w, "获取个人信息成功", requester)
}
