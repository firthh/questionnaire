(ns clojure-api-seed.test.handler
  (:use midje.sweet)
  (:require [clojure-api-seed.handler :refer :all]
            [clojure-api-seed.database :as db]
            [ring.mock.request :as mock]
            [clojure.data.json :as json]
            ))

(def account {:name "Hugo"})
(def account-response {:id 1 :name "Hugo"})
(def account-json (json/write-str account))
(def account-response-json (json/write-str account-response))

(facts "routes"
       (facts "accounts"
              (fact "status"
                    (-> (mock/request :post "/account" account-json)
                        (mock/content-type "application/json")
                        app
                        :status) => 200
                    (provided
                     (db/insert-account anything) => {}))

              (fact "body"
                    (-> (mock/request :post "/account" account-json)
                        (mock/content-type "application/json")
                        app
                        :body) => account-response-json
                    (provided
                     (db/insert-account {:name "Hugo"}) => account-response))
              (fact "content type"
                    (-> (mock/request :post "/account" account-json)
                        (mock/content-type "application/json")
                        app
                        :headers
                        (get "Content-Type")) => "application/json"

                    (provided
                     (db/insert-account {:name "Hugo"}) => {})))
       (facts "main route"
              (let [response (app (mock/request :get "/"))]
                (fact "status"
                      (:status response) => 200)
                (fact "body"
                      (:body response) => "Hello World")))
       (facts "not found"
              (let [response (app (mock/request :get "/invalid"))]
                (fact "status"
                      (:status response) => 404))))
