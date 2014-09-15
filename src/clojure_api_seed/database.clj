(ns clojure-api-seed.database
  (:use korma.db
        korma.core
        korma.config))

(defdb pg (postgres {
                     :db       (or (System/getenv "DB_NAME")             "cas")
                     :user     (or (System/getenv "SNAP_DB_PG_USER")     "postgres")
                     :password (or (System/getenv "SNAP_DB_PG_PASSWORD") "postgres")
                     :host     (or (System/getenv "SNAP_DB_PG_HOST")     "localhost")
                     :port     (or (System/getenv "SNAP_DB_PG_PORT")     "5432")
                     }))

(declare account)

(defentity account
  (pk :id)
  (table :accounts)
  (database pg))

(defn insert-account [account-to-insert]
  (insert account
          (values account-to-insert)))
