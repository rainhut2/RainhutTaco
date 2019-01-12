var SQLite = require('react-native-sqlite-storage')

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class tacoDbHelper {
    constructor() {
        
    }
    setup(callback) {
        global.Buffer = global.Buffer || require('buffer').Buffer
        SQLite.openDatabase({name : "taco.db"}, (db) => {
            this.db = db
            this.db.transaction((tx) => {
              tx.executeSql('CREATE TABLE  IF NOT EXISTS `saved_books` (`bookid` varchar(36) NOT NULL,`json` text NOT NULL,`thumbnail` text NOT NULL,`date` datetime NOT NULL,PRIMARY KEY (`bookid`))')
              .catch((error) => {
                  console.log(error)
            })
            if(callback) {
                callback();
            }
          })
        })
    }

    destroy() {

    }

    deleteBook(bookid, callback) {
        this.db.transaction((tx) => {
            var sqlString = 'Delete from saved_books where bookid = "' + bookid + '";'
                tx.executeSql(sqlString).then(() => {
                  callback()
                })
                }).catch((error) =>{
                  console.log("Received error: ", error)
                  callback(error)
                });

    }

    Base64Encode = (str, encoding = "utf8") => {
        str = unescape(encodeURIComponent(str));
        return global.Buffer.from(str).toString("base64");
      }
      
     Base64Decode = (str, encoding = "utf8") =>  {
        str = global.Buffer.from(str, "base64").toString();
        str = decodeURIComponent(escape(str));
        return str;
      }

    insertCurrentBook(callback) {
        //save the book...
        var sqlString = '';

        if(global.bookFromSaved == true) {
            sqlString = 'UPDATE saved_books SET json = "' + this.Base64Encode(JSON.stringify(global.book)) + '", thumbnail = "'  + 
            global.book.pages[0].sampleImage2 + '" WHERE bookid = "' + global.book.bookId + '"';
        }
        else {
            sqlString = 'INSERT INTO saved_books (bookid, json, thumbnail, date) VALUES ("' + 
            global.book.bookId + '","' + this.Base64Encode(JSON.stringify(global.book)) + '","'  + 
            global.book.pages[0].sampleImage2 + '", "' + Date().toString() + '");'
        }
        this.db.transaction((tx) => {
            tx.executeSql(sqlString).then(() => {
              callback()
            })
            }).catch((error) =>{
              console.log("Received error: ", error)
              callback(error)
            });
    }

    getAll(callback) {
           this.db.transaction((tx) => {
            var sqlString = 'Select * from saved_books'
                tx.executeSql(sqlString).then(([tx,result]) => {
                    var items = []
                    for(var i=0; i<result.rows.length; i++) {
                        let row = result.rows.item(i);
                        row.json = JSON.parse(this.Base64Decode(row.json))
                        items.push(row)
                    }
                    
                  callback(items, null)
                })
                }).catch((error) =>{
                  console.log("Received error: ", error)
                  callback(null, error)
                });

    }

}
module.exports = tacoDbHelper