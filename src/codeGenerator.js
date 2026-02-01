// Code Generator Helper - generates code snippets for all supported languages
// Use this to generate the codeByLanguage object for the CodeRequestPanel component

export const generateCodeSnippets = ({
  method = 'POST',
  url,
  jsonrpcMethod,
  params = {},
}) => {
  const paramsJson = JSON.stringify(params, null, 4).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n');
  const paramsOneLine = JSON.stringify(params);

  const curl = `curl --request ${method} \\
  --url '${url}' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "${jsonrpcMethod}",
  "params": ${paramsJson}
}
'`;

  const python = `import requests

url = "${url}"

payload = {
    "jsonrpc": "2.0",
    "id": "1",
    "method": "${jsonrpcMethod}",
    "params": ${paramsJson}
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)`;

  const javascript = `const options = {
  method: '${method}',
  headers: {
    Authorization: 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: '1',
    method: '${jsonrpcMethod}',
    params: ${paramsJson}
  })
};

fetch('${url}', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));`;

  const php = `<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${url}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "${method}",
  CURLOPT_POSTFIELDS => json_encode([
    'jsonrpc' => '2.0',
    'id' => '1',
    'method' => '${jsonrpcMethod}',
    'params' => ${JSON.stringify(params)}
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer <token>",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`;

  const go = `package main

import (
	"fmt"
	"strings"
	"net/http"
	"io"
)

func main() {

	url := "${url}"

	payload := strings.NewReader(\`{"jsonrpc": "2.0","id": "1","method": "${jsonrpcMethod}","params": ${paramsOneLine}}\`)

	req, _ := http.NewRequest("${method}", url, payload)

	req.Header.Add("Authorization", "Bearer <token>")
	req.Header.Add("Content-Type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))

}`;

  const java = `HttpResponse<String> response = Unirest.post("${url}")
  .header("Authorization", "Bearer <token>")
  .header("Content-Type", "application/json")
  .body("{\\"jsonrpc\\": \\"2.0\\",\\"id\\": \\"1\\",\\"method\\": \\"${jsonrpcMethod}\\",\\"params\\": ${JSON.stringify(params).replace(/"/g, '\\"')}}")
  .asString();`;

  const ruby = `require 'uri'
require 'net/http'

url = URI("${url}")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Authorization"] = 'Bearer <token>'
request["Content-Type"] = 'application/json'
request.body = '{"jsonrpc": "2.0","id": "1","method": "${jsonrpcMethod}","params": ${paramsOneLine}}'

response = http.request(request)
puts response.read_body`;

  return {
    'curl': curl,
    'Python': python,
    'JavaScript': javascript,
    'PHP': php,
    'Go': go,
    'Java': java,
    'Ruby': ruby,
  };
};

// Pre-generated code snippets for each endpoint
export const identityLookupCode = generateCodeSnippets({
  method: 'POST',
  url: 'https://share-ddn.formless.xyz/v1#identity_get_by_email_address',
  jsonrpcMethod: 'identity_get_by_email_address',
  params: { email_address: 'user@example.com' },
});

export const createContractCode = generateCodeSnippets({
  method: 'POST',
  url: 'https://share-ddn.formless.xyz/v1#contracts_create',
  jsonrpcMethod: 'contracts_create',
  params: {
    type: 'digital_property_with_revenue_share',
    network: 'base',
    title: 'HYPERMAX SNEAKER RELEASE',
    description: 'Community revenue sharing for HYPERMAX',
    creator_name: 'HYPERMAX Brand',
    revenue_share: {
      recipients: {},
      community_allocation_percent: 100,
      community_split_count: 100,
      distribution_unit: {
        value: 1,
        currency: 'USD'
      }
    },
    revenue_source: {}
  },
});

export const fetchSplitDataCode = generateCodeSnippets({
  method: 'POST',
  url: 'https://share-ddn.formless.xyz/v1#splits_fetch_data',
  jsonrpcMethod: 'splits_fetch_data',
  params: {
    contract_address: '0x123456789abcdef123456789abcdef',
    network_id: 8453,
    page: 0,
    page_size: 25
  },
});

export const executePayoutCode = generateCodeSnippets({
  method: 'POST',
  url: 'https://share-ddn.formless.xyz/v1#payouts',
  jsonrpcMethod: 'payouts',
  params: {
    idempotency_key: 'unique-payout-key-123',
    recipient_type: 'smart_contract',
    recipient_id: '7a2ab0d5-27d8-482f-becf-0ac3217e0b1a',
    amount: {
      value: 10,
      currency: 'USD'
    }
  },
});

export const queryBatchStatusCode = generateCodeSnippets({
  method: 'POST',
  url: 'https://share-ddn.formless.xyz/v1#payouts_query_batch',
  jsonrpcMethod: 'payouts',
  params: {
    batch_id: '89de4fdd-a8e5-4888-9c29-ebac29dec4cb'
  },
});

// Response schemas for each endpoint
export const responseSchemas = {
  identityLookup: {
    jsonrpc: '2.0',
    id: '<string>',
    result: {
      success: true,
      user_unique_id: '<string>',
      email_address: 'jsmith@example.com',
      display_name: '<string>',
      verified_identity: true,
      financial_accounts: [{}],
      verifications: [{}]
    }
  },
  createContract: {
    jsonrpc: '2.0',
    id: '<string>',
    result: {
      status: 'success',
      code: 200,
      network_id: 123,
      blockchain_name: '<string>',
      revenue_share_smart_contract_address: '<string>',
      digital_property_contract_address: '<string>',
      digital_property_contract_id: '<string>',
      join_splits_url: '<string>'
    }
  },
  fetchSplitData: {
    jsonrpc: '2.0',
    id: '<string>',
    result: {
      total_slots: '<string>',
      total_splits: 123,
      community_allocation_percent: 123,
      percent_per_slot: 123,
      splits_data: [
        {
          wallet_address: '<string>',
          percentage: 123,
          unique_id: '<string>',
          display_name: '<string>',
          email_address: '<string>',
          verified_identity: true
        }
      ],
      pagination: {
        total_records: 123,
        current_page: 123,
        total_pages: 123
      }
    }
  },
  executePayout: {
    jsonrpc: '2.0',
    id: '<string>',
    result: {
      batch_id: '<string>',
      status: 'pending',
      message: '<string>'
    }
  },
  queryBatchStatus: {
    jsonrpc: '2.0',
    id: '<string>',
    result: {
      payout_batch_id: '<string>',
      status: 'pending',
      submitter: '<string>',
      timestamp: {},
      details: {},
      activity_details: {},
      successful_txns: 123,
      incomplete_txns: 123,
      completion_percentage: 123,
      total_amount_paid_usd: 123,
      message: '<string>',
      failure: '<string>'
    }
  }
};

export default generateCodeSnippets;
