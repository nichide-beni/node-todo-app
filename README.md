# サンプルTODOアプリの構築手順書

## 初期構築

### サーバー機能

Expressで構築するバックエンドサーバー。  

#### サーバー機能の概要

サーバー機能は「express」を使って構築されている。  
データは「SQLite」を使って保持するため、ローカル動作を前提としたもの。  

#### サーバー機能の初期構築

カレントディレクトリを「server」に移動、またはそこでターミナルを立ち上げ、以下のコマンドを実行する。  

```bash
# プロジェクト作成者のみ
cd server
npm init -y
volta pin node@lts
volta pin npm@11.6.2 # 時期に依存
npm install express sqlite sqlite3 cors

# gitなどから引き継いだ場合は以下を実行する
npm install
```

### クライアント機能

Vueで構成するフロントエンド(メイン)。  

#### クライアント機能の初期構築

カレントディレクトリを「client」に移動、またはそこでターミナルを立ち上げ、以下のコマンドを実行する。

```bash
npm create vite@latest client -- --template vue
# rolldown が出たらnoを選択

cd client
volta pin node@lts
volta pin npm@11.6.2 # 時期に依存
npm install vue-router@4

# gitなどから引き継いだ場合は以下を実行する
npm install
```

## アプリの立ち上げ方法

最初にサーバー側のプログラムを立ち上げ、その後にクライアント側のアプリを立ち上げる。  
「server」、「client」それぞれのディレクトリから立ち上げるか、ターミナルを2つ立ち上げる。    

```bash
# server側を立ち上げる場合
cd server
npm start

# client側を立ち上げる場合
cd client
npm start
```
