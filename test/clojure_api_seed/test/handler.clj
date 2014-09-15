(ns clojure-api-seed.test.handler
  (:use midje.sweet)
  (:require [clojure-api-seed.handler :refer :all]
            [ring.mock.request :as mock]
            [clojure.data.json :as json]))

(def valid-account
  "{\"nick-name\":\"hugo\"}")

(facts "routes"
       (facts "accounts"
              (let [response (app (mock/request :post "/account" valid-account))]
                (fact "status"
                      (:status response) => 200)
                (fact "body"
                      (slurp (:body response)) => valid-account)
                (fact "content type"
                      (get (:headers response) "Content-Type") => "application/json")))
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
