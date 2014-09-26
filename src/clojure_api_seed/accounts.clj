(ns clojure-api-seed.accounts
  (:require [bouncer [core :as b] [validators :as v]]))



(defn create-account [account]
  (b/validate account
              :name v/required))
