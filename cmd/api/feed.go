package main

import "net/http"

func (app *Application) getUserFeedHandler(w http.ResponseWriter, r *http.Request) {
	// pagination on search, filters

	ctx := r.Context()
	posts, err := app.store.Posts.GetUserFeed(ctx, int64(5))
	if err != nil {
		app.internalServerError(w, r, err)
	}
	if err := app.jsonResponse(w, http.StatusOK, posts); err != nil {
		app.internalServerError(w, r, err)
	}
}
