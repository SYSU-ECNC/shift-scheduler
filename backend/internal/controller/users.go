package controller

import "net/http"

func (ctrl *Controller) getAllUserID(w http.ResponseWriter, r *http.Request) {
	ids, err := ctrl.repo.GetAllUserID(r.Context())
	if err != nil {
		ctrl.internalServerError(w, err)
		return
	}

	ctrl.writeJSON(w, http.StatusOK, ids)
}
