(ns clojure-api-seed.handler
  (:use ring.middleware.json)
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.util.response :refer :all]
            [ring.middleware.defaults :refer :all]
            [clojure.data.json :as json]
            [clojure-api-seed.database :as db]))

(defroutes app-routes
  (GET "/" [] "Hello World")
  (POST "/account" {body :body}
        (let [insert-result (db/insert-account body)]
          (content-type (response insert-result) "application/json")))
  (route/resources "/")
  (route/not-found "Not Found"))

(def defaults (merge api-defaults {}))

(def app
  (-> (handler/site app-routes)
      wrap-json-response
      (wrap-json-body {:keywords? true :bigdecimals? true})
      (wrap-defaults defaults)
      ))
