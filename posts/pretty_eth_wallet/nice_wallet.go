// Find nice ethereum wallet key pair.
//
// Example use:
//	$ go run nice_wallet.go '00000$'

package main

import (
	"crypto/ecdsa"
	"fmt"
	"os"
	"regexp"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
)

var wg sync.WaitGroup
var r *regexp.Regexp
var tries uint64
var start time.Time

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: prog pattern")
	}
	r = regexp.MustCompile(os.Args[1])
	cores := runtime.NumCPU()
	wg.Add(1)
	start = time.Now()
	for i := 0; i < cores; i++ {
		go search()
	}
	wg.Wait()
}

func search() {
	for {
		tries++

		address, private, err := GenerateKeyPair()
		if err != nil {
			continue
		}

		if r.Match([]byte(strings.ToLower(address))) {
			fmt.Printf("addr=%s priv=%s tries=%d took=%v\n",
				address, private, tries, time.Since(start))
			wg.Done()
		}
	}
}

func GenerateKeyPair() (string, string, error) {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		return "", "", err
	}

	privateKeyBytes := crypto.FromECDSA(privateKey)
	private := hexutil.Encode(privateKeyBytes)[2:]

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return "", "", fmt.Errorf("Failed casting public key to ECDSA")
	}

	address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()[2:]

	return address, private, nil
}
