package bitnob

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"time"
)

// GenerateNonce generates a 16-byte cryptographically-random value, hex-encoded
func GenerateNonce() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

// GenerateTimestamp returns the current Unix timestamp in seconds
func GenerateTimestamp() string {
	return strconv.FormatInt(time.Now().Unix(), 10)
}

// BuildCanonicalMessage builds the message to be signed
// Format: CLIENT_ID:TIMESTAMP:NONCE:PAYLOAD
func BuildCanonicalMessage(clientID, timestamp, nonce, payload string) string {
	return fmt.Sprintf("%s:%s:%s:%s", clientID, timestamp, nonce, payload)
}

// GenerateSignature computes HMAC-SHA256 signature
func GenerateSignature(message, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(message))
	return hex.EncodeToString(h.Sum(nil))
}

// AuthHeaders represents the HMAC authentication headers
type AuthHeaders struct {
	ClientID  string
	Timestamp string
	Nonce     string
	Signature string
}

// GenerateAuthHeaders generates all required authentication headers
func GenerateAuthHeaders(clientID, clientSecret, payload string) (*AuthHeaders, error) {
	nonce, err := GenerateNonce()
	if err != nil {
		return nil, err
	}
	
	timestamp := GenerateTimestamp()
	message := BuildCanonicalMessage(clientID, timestamp, nonce, payload)
	signature := GenerateSignature(message, clientSecret)
	
	return &AuthHeaders{
		ClientID:  clientID,
		Timestamp: timestamp,
		Nonce:     nonce,
		Signature: signature,
	}, nil
}
