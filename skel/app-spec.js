describe("App", function () {
    before(function () {
       this.sut = new App() 
    });
    it("should say hello", function () {
        expect(this.sut.hello()).toEqual('Hello');
    });
    it("should say hello to person", function () {
        expect(this.sut.hello('dawg')).toEqual('Hello, dawg');
    });    
});