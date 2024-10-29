package controller

import (
	"encoding/json"
	"errors"
	"net/http"
)

func (ctrl *Controller) readJSON(r *http.Request, v any) error {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return err
	}
	return nil
}

func (ctrl *Controller) writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		ctrl.logger.Error("internal server error", "error", err.Error())
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}

func (ctrl *Controller) writeErrorJSON(w http.ResponseWriter, status int, err error) {
	type envelop struct {
		Error string `json:"error"`
	}
	ctrl.writeJSON(w, status, envelop{
		Error: err.Error(),
	})
}

func (ctrl *Controller) internalServerError(w http.ResponseWriter, err error) {
	ctrl.logger.Error("internal server error", "error", err.Error())
	ctrl.writeErrorJSON(w, http.StatusInternalServerError, errors.New("服务器内部错误"))
}

func (ctrl *Controller) badRequest(w http.ResponseWriter, err error) {
	ctrl.writeErrorJSON(w, http.StatusBadRequest, err)
}

func (ctrl *Controller) notFound(w http.ResponseWriter, err error) {
	ctrl.writeErrorJSON(w, http.StatusNotFound, err)
}

func (ctrl *Controller) unauthorized(w http.ResponseWriter, err error) {
	ctrl.writeErrorJSON(w, http.StatusUnauthorized, err)
}
