package api

// BitnobClient interface for dependency injection
type BitnobClient interface {
	// Transfer methods
	CreateTransfer(req interface{}) (interface{}, error)

	// Payout methods
	CreatePayoutQuote(req interface{}) (interface{}, error)
	InitializePayout(req interface{}) (interface{}, error)
	FinalizePayout(req interface{}) (interface{}, error)
	GetCountryRequirements(country string) (interface{}, error)
	GetTransactionLimits() (interface{}, error)

	// Trading methods
	CreateTradingQuote(req interface{}) (interface{}, error)
	CreateOrder(req interface{}) (interface{}, error)
	GetOrders() (interface{}, error)
	GetOrderByID(id string) (interface{}, error)
}
