# push-message

メッセージを送信する。

## 備忘録

PHPと依存関係解決ライブラリであるComposerを追加

```
$ brew install php
# ref: https://getcomposer.org/download/
$ php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
$ php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
$ php composer-setup.php
$ php -r "unlink('composer-setup.php');"
```

ライブラリを追加

```
$ composer require google/apiclient google/cloud-functions-framework
```

## デプロイ

```
$ gcloud functions deploy sendCloudMessage --runtime php83 --trigger-http --allow-unauthenticated --project sa2taka-web-push-test
```
