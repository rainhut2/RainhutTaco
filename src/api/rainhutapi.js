var CryptoJS = require("crypto-js");
 
const APIBaseURL = "http://192.168.1.103:3002/" //local
//const APIBaseURL = "http://54.174.89.183:8084/" //dev stage server
//const APIBaseURL = "https://artapi2.rainhut.com/" //live
 
class rainhutapi {
    constructor(privateKey, publicKey) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    getTimestamp() {
        return Math.floor(new Date() / 1000);
    }

    getAuthenticationString(ts, bookId) {
        var strToHash = "ts" + ts + this.publicKey + bookId;
        var authString = CryptoJS.HmacSHA256(
            strToHash,
            this.privateKey
        ).toString();
        return authString;
    }

    createBook(entries, setup, callback) {
        var ts = this.getTimestamp()
        var authString = this.getAuthenticationString(ts, "")
        var body = { entries: entries, setup: setup, auth: authString, pk: this.publicKey, ts: ts }

        fetch(APIBaseURL + "books/create2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(callback)
            .catch(function (e) {
                callback({ "status": "error", "message": e.message })
            });
    }

    updateBook(book, callback) {
        var ts = this.getTimestamp()
        var authString = this.getAuthenticationString(ts, book.bookId)
        book.auth = authString
        book.pk = this.publicKey
        book.ts = ts

        var bookStr = JSON.stringify(book)
        fetch(APIBaseURL + "books/update2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: bookStr
        }).then(res => res.json())
            .then(callback)
            .catch(function (e) {
                callback({ "status": "error", "message": e.message })
            });
    }

    uploadBook(book, callback) {
        var ts = this.getTimestamp()
        var authString = this.getAuthenticationString(ts, book.bookId)
        var body = { bookId: book.bookId, pages: book.pages, setup: book.setup, auth: authString, pk: this.publicKey, ts: ts }

       fetch(APIBaseURL + "books/upload2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(callback)
            .catch(function (e) {
                callback({ "status": "error", "message": e.message })
            });

    }

}
module.exports = rainhutapi