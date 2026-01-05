package bitnob

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

type Client struct {
	baseURL      string
	clientID     string
	clientSecret string
	httpClient   *http.Client
}

// NewClient creates a new Bitnob API client
func NewClient(baseURL, clientID, clientSecret string) *Client {
	return &Client{
		baseURL:      baseURL,
		clientID:     clientID,
		clientSecret: clientSecret,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// makeRequest is a generic method to make authenticated requests to Bitnob API
func (c *Client) makeRequest(method, endpoint string, body interface{}, response interface{}) error {
	var payload string
	var bodyReader io.Reader

	// Prepare payload
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		payload = string(jsonData)
		bodyReader = bytes.NewBuffer(jsonData)
	} else {
		payload = ""
		bodyReader = nil
	}

	log.Printf("Making request to: %s%s", c.baseURL, endpoint)
	log.Printf("Request payload: %s", payload)

	// Generate auth headers
	authHeaders, err := GenerateAuthHeaders(c.clientID, c.clientSecret, payload)
	if err != nil {
		return fmt.Errorf("failed to generate auth headers: %w", err)
	}

	// Create request
	url := c.baseURL + endpoint
	req, err := http.NewRequest(method, url, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Auth-Client", authHeaders.XAuthClient)
	req.Header.Set("X-Auth-Timestamp", authHeaders.XAuthTimestamp)
	req.Header.Set("X-Auth-Nonce", authHeaders.XAuthNonce)
	req.Header.Set("X-Auth-Signature", authHeaders.XAuthSignature)

	log.Printf("Auth headers - Client: %s, Timestamp: %s, Nonce: %s, Signature: %s", 
		authHeaders.XAuthClient, authHeaders.XAuthTimestamp, authHeaders.XAuthNonce, authHeaders.XAuthSignature)

	// Make request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	// Check status code
	log.Printf("Response status: %d", resp.StatusCode)
	log.Printf("Response body: %s", string(respBody))
	
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse response
	if response != nil {
		if err := json.Unmarshal(respBody, response); err != nil {
			return fmt.Errorf("failed to parse response: %w. Response body: %s", err, string(respBody))
		}
	}

	return nil
}

// GET makes a GET request
func (c *Client) GET(endpoint string, response interface{}) error {
	return c.makeRequest(http.MethodGet, endpoint, nil, response)
}

// POST makes a POST request
func (c *Client) POST(endpoint string, body interface{}, response interface{}) error {
	return c.makeRequest(http.MethodPost, endpoint, body, response)
}

// Transfer Methods
func (c *Client) CreateTransfer(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/wallets/transfers", req, &response)
	return response, err
}

// Payout Methods
func (c *Client) CreatePayoutQuote(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/payouts/quotes", req, &response)
	return response, err
}

func (c *Client) InitializePayout(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/payouts/initialize", req, &response)
	return response, err
}

func (c *Client) FinalizePayout(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/payouts/finalize", req, &response)
	return response, err
}

func (c *Client) GetCountryRequirements(country string) (interface{}, error) {
	var response interface{}
	err := c.GET(fmt.Sprintf("/payouts/countries/%s/requirements", country), &response)
	return response, err
}

func (c *Client) GetTransactionLimits() (interface{}, error) {
	var response interface{}
	err := c.GET("/payouts/limits", &response)
	return response, err
}

// Trading Methods
func (c *Client) CreateTradingQuote(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/trading/quotes", req, &response)
	return response, err
}

func (c *Client) CreateOrder(req interface{}) (interface{}, error) {
	var response interface{}
	err := c.POST("/trading/orders", req, &response)
	return response, err
}

func (c *Client) GetOrders() (interface{}, error) {
	var response interface{}
	err := c.GET("/trading/orders", &response)
	return response, err
}

func (c *Client) GetOrderByID(id string) (interface{}, error) {
	var response interface{}
	err := c.GET(fmt.Sprintf("/trading/orders/%s", id), &response)
	return response, err
}
