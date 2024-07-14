<?php
require_once __DIR__ . '/vendor/autoload.php';

use Google_Client;
use Google\CloudFunctions\FunctionsFramework;
use Psr\Http\Message\ServerRequestInterface;

FunctionsFramework::http('sendCloudMessage', 'sendCloudMessage');


// NOTE: Cloud Function用の設定がいくつか入ってます。本質的な処理は38行目以降です。
function sendCloudMessage(ServerRequestInterface $request)
{
    // Enable CORS
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    // Check if it's a preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
      http_response_code(204);
      exit();
    }

    // NOTE: 下記はCloud Functionを利用するのでDefault Credentialを利用しています。
    //       Cloud Function等、Google Cloud Platform上ではDefault Credentialという機能で認証キー無しでAPIを叩けます。
    //       任意のレンタルサーバーではIAMからAPIキーを取得するか、実行する際の環境で認証情報を設定してください。
    //       1. Service Accountのキーを利用する方法。あまりおすすめはしない。
    //           1. サービスアカウント -> キー -> 鍵を追加でJSONファイルをダウンロード
    //           2. 環境変数に設定
    //              export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
    //           3. PHPで利用
    //              $client = new Google_Client();
    //              $client->useApplicationDefaultCredentials();
    //              $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
    //              $httpClient = $client->authorize();
    //       2. デフォルトアカウントを利用する方法
    //           1. `gcloud auth application-default login --impersonate-service-account <service-accountのメールアドレス>` を実行する
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
    $httpClient = $client->authorize();

    $project = 'sa2taka-web-push-test';

    // リクエストからデータを取得
    $requestData = json_decode($request->getBody()->getContents(), true);
    $title = $requestData['title'] ?? '';
    $body = $requestData['body'] ?? '';
    $token = $requestData['token'] ?? '';

    // メッセージペイロードの作成
    // ref: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send?hl=ja
    // ref: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages?hl=ja#Message
    $params = [
        'message' => [
            // topicという概念があるが、PHPだけだと多分無理っぽい
            // TopicはTokenと紐づける必要があるが、TopicとTokenを紐づける手段がFirebase Admin SDKのみであり、PHPにはない。APIにも公開されていない。
            // ref: https://firebase.google.com/docs/cloud-messaging/manage-topics?hl=ja
            // 'topic' => $topic,
            'token' =>  $token,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
            'webpush' => [
              'fcm_options' => [
                'link' => 'https://sa2taka-web-push-test.web.app/'
              ]
            ]
        ],
    ];

    // FCM APIへのリクエスト送信
    $response = $httpClient->post("https://fcm.googleapis.com/v1/projects/$project/messages:send", 
        ['json' => $params]
    );

    return 'Notification sent successfully. Response: ' . $response->getBody();
}
