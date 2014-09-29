(ns clojure-api-seed.handler
  (:use ring.middleware.json)
  (:require [compojure.core :refer :all]
            [compojure.handler :as handler]
            [compojure.route :as route]
            [ring.util.response :refer :all]
            [ring.middleware.defaults :refer :all]
            [clojure.data.json :as json]))

(def questions (atom []))


(defroutes app-routes
  (GET "/" [] (redirect "/index.html"))
  (GET "/questions.json" []
       (do
         (content-type (response @questions) "application/json")))
  (POST "/questions.json" {body :body}
        (do
          ;; (println body)
          (let [question (assoc body :id (inc (count @questions)))]
            (swap! questions conj question)
            (content-type (response @questions) "application/json"))))
  (route/resources "/")
  (route/not-found "Not Found"))

(def defaults (merge api-defaults {}))

(def app
  (-> (handler/site app-routes)
      wrap-json-response
      (wrap-json-body {:keywords? true :bigdecimals? true})
      (wrap-defaults defaults)
      ))
