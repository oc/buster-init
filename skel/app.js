function App() {}

App.prototype = {
    hello: function (n) {
        if (typeof n === 'undefined') return 'Hello';
        return 'Hello, ' + n;
    }    
}