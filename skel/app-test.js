buster.testCase("App", {
   setUp: function () {
     this.sut = new App();
   },
   "should say hello": function () {
       assert.equals(this.sut.hello(), 'Hello');
   },
   "should say hello to person": function () {
       assert.equals(this.sut.hello('dawg'), 'Hello, dawg');
   }
});