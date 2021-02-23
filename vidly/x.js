// Return endpoint for rentals: POST /api/returns { customerId, movieId }

// Return 401 if user is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for provided customerId/movieId
// Return 400 if return already proceessed
// Return 200 if request is valid
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

