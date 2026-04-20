package main

import (
	"net/http"

	"github.com/govindti/echonet/internal/store"
)

type RegisterUserPayload struct {
	Username string `json:"username" validate:"required, max=100"`
	Email    string `json:"email" validate:"required, max=255"`
	Password string `json:"password" validate:"required, min=3, max=72"`
}

// registerUserHandler godoc

// @Summary		Register a new user
// @Description	Registers a new user
// @Tags			Authentication
// @Accept			json
// @Produce		json
// @Param			payload	body	RegisterUserPayload	true	"User credentials"
// @Sucuss			201 {object} store.User "User registed"
// @Failure		400	{object}	error
// @Failure		500	{object}	error
// @Router			/api/v1/authentication/user [get]
func (app *Application) registerUserHandler(w http.ResponseWriter, r *http.Request) {
	var payload RegisterUserPayload
	if err := readJSON(w, r, &payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(payload); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := &store.User{
		Username: payload.Username,
		Email:    payload.Email,
	}

	// hash the user password
	if err := user.Password.Set(payload.Password); err != nil {
		app.internalServerError(w, r, err)
		return
	}

	ctx := r.Context()
	// store the user
	err := app.store.Users.CreateAndInvite(ctx, user, "uuidv4")

	if err := app.jsonResponse(w, http.StatusCreated, nil); err != nil {
		app.internalServerError(w, r, err)
	}
}
