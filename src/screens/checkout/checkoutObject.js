export const checkoutObjectInit = function() {
    //could call api here to get dynamic price etc...
    return {title: 'book',  price: 20.00,  pageNumbers: global.book.pages.length,
    shipping: {street: '', city: '', state: '', country: '', zip: ''}, 
    billing: {street: '', city: '', state: '', country: '', zip: ''},
    }
}