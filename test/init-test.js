var fs = require("fs");

buster.testCase("init", {
    setUp: function() {
        this.sut = require("../lib/init").create();
        this.sut.findConfigFile = function (_) { return undefined; }
        this.spy(fs, "writeFile"); // TODO: figure out why this is not #$& mocked.
    },
    "by default, should init plain xUnit project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("plain");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'test');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'plain');
            assert.match(cli.paths.lib, 'lib');
            assert.match(cli.paths.src, 'src');
            assert.match(cli.paths.test, 'test');
            assert.calledOnce(detect);
        }));

        this.sut.run([]);
    },
    "should init plain BDD-style project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("plain");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'spec');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'plain');
            assert.match(cli.paths.lib, 'lib');
            assert.match(cli.paths.src, 'src');
            assert.match(cli.paths.test, 'spec');
            assert.calledOnce(detect);
        }));

        this.sut.run(['-s']);
    },
    "should init Leiningen xUnit project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("lein");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'test');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'lein');
            assert.match(cli.paths.lib, 'resources/public/ext');
            assert.match(cli.paths.src, 'resources/public/js');
            assert.match(cli.paths.test, 'test');
            assert.calledOnce(detect);
        }));

        this.sut.run([]);
    },
    "should init Leiningen BDD project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("lein");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'spec');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'lein');
            assert.match(cli.paths.lib, 'resources/public/ext');
            assert.match(cli.paths.src, 'resources/public/js');
            assert.match(cli.paths.test, 'spec');
            assert.calledOnce(detect);
        }));

        this.sut.run(['-s']);
    },
    "should init maven xUnit project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("maven");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'test');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'maven');
            assert.match(cli.paths.lib, 'src/main/webapp/lib-external');
            assert.match(cli.paths.src, 'src/main/webapp/lib');
            assert.match(cli.paths.test, 'src/test/javascript');
            assert.calledOnce(detect);
        }));

        this.sut.run([]);
    },
    "should init sbt xUnit project": function(done) {
        var detect = this.stub(this.sut.detecter, "detect").returns("sbt");

        this.stub(this.sut, "configure", done(function(cli) {
            assert.equals(cli.testStyle, 'test');
            assert.equals(cli.prefix, '.');
            assert.equals(cli.project, 'sbt');
            assert.match(cli.paths.lib, 'src/main/webapp/lib-external');
            assert.match(cli.paths.src, 'src/main/webapp/lib');
            assert.match(cli.paths.test, 'src/test/javascript');
            assert.calledOnce(detect);
        }));

        this.sut.run([]);
    },
    "writeFile should be called once": function() {
        this.sut.run([]);
        assert.calledOnce(fs.writeFile);
    }

});