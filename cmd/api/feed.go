package main

import (
	"net/http"

	"github.com/govindti/echonet/internal/store"
)

func (app *Application) getUserFeedHandler(w http.ResponseWriter, r *http.Request) {
	// pagination on search, filters
	fq := store.PaginatedFeedQuery{
		Limit:  20,
		Offset: 0,
		Sort:   "desc",
	}

	fq, err := fq.Parse(r)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if err := Validate.Struct(fq); err != nil {
		app.badRequestResponse(w, r, err)
		return 
	}

	ctx := r.Context()
	posts, err := app.store.Posts.GetUserFeed(ctx, int64(5), fq)
	if err != nil {
		app.internalServerError(w, r, err)
	}
	if err := app.jsonResponse(w, http.StatusOK, posts); err != nil {
		app.internalServerError(w, r, err)
	}
}
