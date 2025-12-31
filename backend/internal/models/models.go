package models

import "time"

// Transfer Models
type TransferRequest struct {
	ToAddress   string `json:"to_address" binding:"required"`
	Amount      string `json:"amount" binding:"required"`
	Currency    string `json:"currency" binding:"required"`
	Chain       string `json:"chain" binding:"required"`
	Reference   string `json:"reference"`
	Description string `json:"description"`
}

type TransferResponse struct {
	Success       bool      `json:"success"`
	Message       string    `json:"message"`
	TransactionID string    `json:"transaction_id"`
	Status        string    `json:"status"`
	Address       string    `json:"address"`
	Amount        string    `json:"amount"`
	Currency      string    `json:"currency"`
	Chain         string    `json:"chain"`
	Network       string    `json:"network"`
	Reference     string    `json:"reference"`
	CreatedAt     time.Time `json:"created_at"`
	Description   string    `json:"description"`
	RequestID     string    `json:"request_id"`
	Timestamp     time.Time `json:"timestamp"`
}

// Payout Models
type PayoutQuoteRequest struct {
	Source           string  `json:"source" binding:"required"`
	FromAsset        string  `json:"fromAsset" binding:"required"`
	ToCurrency       string  `json:"toCurrency" binding:"required"`
	Chain            string  `json:"chain"`
	Amount           float64 `json:"amount"`
	SettlementAmount float64 `json:"settlementAmount"`
}

type PayoutQuoteResponse struct {
	ID                 string  `json:"id"`
	Status             string  `json:"status"`
	SettlementCurrency string  `json:"settlementCurrency"`
	ExchangeRate       float64 `json:"exchangeRate"`
	QuoteID            string  `json:"quoteId"`
	SettlementAmount   float64 `json:"settlementAmount"`
	Amount             float64 `json:"amount"`
	BtcRate            float64 `json:"btcRate"`
	SatAmount          float64 `json:"satAmount"`
	ExpiryTimeStamp    int64   `json:"expiryTimeStamp"`
	ExpiresInText      string  `json:"expiresInText"`
	QuoteText          string  `json:"quoteText"`
}

type BeneficiaryDetails struct {
	Type          string `json:"type"`
	BankCode      string `json:"bankCode"`
	AccountName   string `json:"accountName"`
	AccountNumber string `json:"accountNumber"`
	Network       string `json:"network,omitempty"`
	PhoneNumber   string `json:"phoneNumber,omitempty"`
}

type InitializePayoutRequest struct {
	QuoteID        string                 `json:"quoteId" binding:"required"`
	CustomerID     string                 `json:"customerId" binding:"required"`
	Country        string                 `json:"country" binding:"required"`
	Reference      string                 `json:"reference" binding:"required"`
	PaymentReason  string                 `json:"paymentReason" binding:"required"`
	BeneficiaryID  string                 `json:"beneficiaryId,omitempty"`
	Beneficiary    *BeneficiaryDetails    `json:"beneficiary,omitempty"`
	CallbackURL    string                 `json:"callbackUrl,omitempty"`
	ClientMetaData map[string]interface{} `json:"clientMetaData,omitempty"`
}

type InitializePayoutResponse struct {
	Fees               float64             `json:"fees"`
	ID                 string              `json:"id"`
	Address            string              `json:"address"`
	Chain              string              `json:"chain"`
	Status             string              `json:"status"`
	PaymentETA         string              `json:"paymentETA"`
	Reference          string              `json:"reference"`
	FromAsset          string              `json:"fromAsset"`
	QuoteID            string              `json:"quoteId"`
	PaymentReason      string              `json:"paymentReason"`
	SettlementCurrency string              `json:"settlementCurrency"`
	ExchangeRate       float64             `json:"exchangeRate"`
	ExpiryTimeStamp    int64               `json:"expiryTimeStamp"`
	Amount             float64             `json:"amount"`
	BtcAmount          float64             `json:"btcAmount"`
	SatAmount          float64             `json:"satAmount"`
	ExpiresInText      string              `json:"expiresInText"`
	BeneficiaryDetails interface{}         `json:"beneficiaryDetails"`
	Destination        *BeneficiaryDetails `json:"destination"`
	SettlementAmount   float64             `json:"settlementAmount"`
}

type FinalizePayoutRequest struct {
	QuoteID string `json:"quoteId" binding:"required"`
}

type CountryRequirement struct {
	Status      bool                   `json:"status"`
	Message     string                 `json:"message"`
	Code        string                 `json:"code"`
	Name        string                 `json:"name"`
	Flag        string                 `json:"flag"`
	DialCode    string                 `json:"dialCode"`
	Destination map[string]interface{} `json:"destination"`
}

type TransactionLimits struct {
	Status         bool   `json:"status"`
	Message        string `json:"message"`
	LowerLimit     string `json:"lowerLimit"`
	HigherLimit    string `json:"higherLimit"`
	Currency       string `json:"currency"`
	Country        string `json:"country"`
	Rate           string `json:"rate"`
	UsdLowerLimit  string `json:"usdLowerLimit"`
	UsdHigherLimit string `json:"usdHigherLimit"`
}

// Trading Models
type CreateQuoteRequest struct {
	BaseCurrency  string `json:"base_currency" binding:"required"`
	QuoteCurrency string `json:"quote_currency" binding:"required"`
	Side          string `json:"side" binding:"required"`
	Quantity      string `json:"quantity" binding:"required"`
}

type CreateQuoteResponse struct {
	Success       bool      `json:"success"`
	Message       string    `json:"message"`
	ID            string    `json:"id"`
	BaseCurrency  string    `json:"base_currency"`
	QuoteCurrency string    `json:"quote_currency"`
	Side          string    `json:"side"`
	Quantity      string    `json:"quantity"`
	Price         string    `json:"price"`
	SpreadBps     float64   `json:"spread_bps"`
	ExpiresAt     time.Time `json:"expires_at"`
	CreatedAt     time.Time `json:"created_at"`
	Metadata      struct {
		RequestID string `json:"request_id"`
	} `json:"metadata"`
	Timestamp time.Time `json:"timestamp"`
}

type CreateOrderRequest struct {
	BaseCurrency  string                 `json:"base_currency" binding:"required"`
	QuoteCurrency string                 `json:"quote_currency" binding:"required"`
	Side          string                 `json:"side" binding:"required"`
	Quantity      string                 `json:"quantity" binding:"required"`
	Price         string                 `json:"price" binding:"required"`
	QuoteID       string                 `json:"quote_id" binding:"required"`
	Metadata      map[string]interface{} `json:"metadata,omitempty"`
}

type OrderResponse struct {
	Success           bool          `json:"success"`
	Message           string        `json:"message"`
	ID                string        `json:"id"`
	BaseCurrency      string        `json:"base_currency"`
	QuoteCurrency     string        `json:"quote_currency"`
	Side              string        `json:"side"`
	OrderType         string        `json:"order_type"`
	Quantity          string        `json:"quantity"`
	Price             string        `json:"price"`
	Status            string        `json:"status"`
	Exchange          string        `json:"exchange"`
	CreatedAt         time.Time     `json:"created_at"`
	UpdatedAt         time.Time     `json:"updated_at"`
	FilledQuantity    string        `json:"filled_quantity"`
	RemainingQuantity string        `json:"remaining_quantity"`
	Fills             []interface{} `json:"fills"`
	Metadata          struct {
		RequestID string `json:"request_id"`
	} `json:"metadata"`
	Timestamp time.Time `json:"timestamp"`
}
