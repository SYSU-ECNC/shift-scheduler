package controller

import (
	"context"
	"errors"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
)

type ContextKey string

var (
	subCtxKey       ContextKey = "sub"
	roleCtxKey      ContextKey = "role"
	requesterCtxKey ContextKey = "requester"
)

func (ctrl *Controller) getSubFromCtx(ctx context.Context) (string, error) {
	subCtx := ctx.Value(subCtxKey)
	if subCtx == nil {
		return "", errors.New("cannot get subctx")
	}

	sub, ok := subCtx.(string)
	if !ok {
		return "", errors.New("cannot convert subctx to string")
	}

	return sub, nil
}

func (ctrl *Controller) getRequesterFromCtx(ctx context.Context) (*domain.User, error) {
	requesterCtx := ctx.Value(requesterCtxKey)
	if requesterCtx == nil {
		return nil, errors.New("cannot get requesterCtx")
	}

	requester, ok := requesterCtx.(*domain.User)
	if !ok {
		return nil, errors.New("cannot convert requester to *domain.User")
	}

	return requester, nil
}
