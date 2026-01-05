package bitnob

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"
)

// AuthHeaders contains the HMAC authentication headers
type AuthHeaders struct {
	XAuthClient    string
	XAuthTimestamp string
	XAuthNonce     string
	XAuthSignature string
}

// GenerateAuthHeaders generates HMAC authentication headers for API requests
func GenerateAuthHeaders(clientID, clientSecret string, body interface{}) (*AuthHeaders, error) {
	if clientID == "" || clientSecret == "" {
		return nil, errors.New("CLIENT_ID or CLIENT_SECRET is not provided")
	}

	// Timestamp in seconds
	timestamp := time.Now().Unix()

	// 16-byte random nonce, hex-encoded
	nonceBytes := make([]byte, 16)
	_, err := rand.Read(nonceBytes)
	if err != nil {
		return nil, err
	}
	nonce := hex.EncodeToString(nonceBytes)

	// Payload: stringify body if provided
	var payload string
	if body != nil {
		switch v := body.(type) {
		case string:
			payload = v
		default:
			jsonBytes, err := json.Marshal(body)
			if err != nil {
				return nil, err
			}
			payload = string(jsonBytes)
		}
	}

	// Build string to sign
	stringToSign := fmt.Sprintf("%s:%d:%s:%s", clientID, timestamp, nonce, payload)
	log.Printf("String to sign: %s", stringToSign)

	// Generate HMAC-SHA256 signature
	h := hmac.New(sha256.New, []byte(clientSecret))
	h.Write([]byte(stringToSign))
	signature := hex.EncodeToString(h.Sum(nil))

	log.Printf("Generated signature: %s", signature)

	return &AuthHeaders{
		XAuthClient:    clientID,
		XAuthTimestamp: fmt.Sprintf("%d", timestamp),
		XAuthNonce:     nonce,
		XAuthSignature: signature,
	}, nil
}