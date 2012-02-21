var buster = require("buster-core");
var busterCli = require("buster-cli");
var prettyJson = require("buster-format").ascii;
var fs = require("fs");

function buildBusterJsConfig(cli) {
    return "var config = module.exports;\n\n" +
    "config['Browser tests'] = {\n" +
    "    environment: 'browser',\n" +
    "    libs:        ['" + cli.paths.lib  + "/**/*.js'],\n" +
    "    sources:     ['" + cli.paths.src  + "/**/*.js'],\n" +
    "    tests:       ['" + cli.paths.test +"/" + cli.testStyle + "-helper.js', '" + cli.paths.test + "/**/*-" + cli.testStyle + ".js']\n" +
    "};\n";
}

function writeBusterJsConfig(cli) {
    fs.writeFile(cli.prefix + '/buster2.js', buildBusterJsConfig(cli), function(err) {
        if (err) throw err;
        cli.logger.info('Wrote config.');
    });
}

module.exports = buster.extend(busterCli.create(), {
    detecter: {
        detect: function(project, prefix) {
            return 'plain';
        },
        implementations: function (cli) {
            return {
                'plain': {
                    src: 'src',
                    test: cli.testStyle,
                    lib: 'lib'
                },
                'lein': {
                    src:  'resources/public/js',
                    test: cli.testStyle,
                    lib:  'resources/public/ext'
                },
                'sbt': {
                    src:  'src/main/webapp/lib',
                    test: 'src/test/javascript',
                    lib:  'src/main/webapp/lib-external'
                },
                'maven': {
                    src:  'src/main/webapp/lib',
                    test: 'src/test/javascript',
                    lib:  'src/main/webapp/lib-external'
                }
            };
        }
    },
    loadOptions: function() {
        this.project = this.opt("-p", "--project", "Type of project: plain, rails, maven, sbt. Will try to detect by default.", ['plain', 'rails', 'maven', 'sbt'], {
            hasValue: true,
            defaultValue: undefined
        });
        this.bdd = this.opt("-s", "--spec", "Use BDD style specs instead of xUnit", {});
        this.prefix = this.opd("<path to project>", "Prefix path to project to initialize. Defaults to current working directory.");
    },
    onRun: function() {
        if (typeof this.findConfigFile(process.cwd()) !== 'undefined') {
            this.logger.error("Found config file: " + this.findConfigFile(process.cwd()) + ", is the project already initialized?");
            return;
        }

        this.testStyle = this.bdd.isSet ? 'spec': 'test';
        this.prefix = this.prefix.isSet ? this.prefix.value: '.';
        this.project = this.detecter.detect(this.project.value, this.prefix);
        this.paths = this.detecter.implementations(this)[this.project];

        this.configure(this);
    },
    configure: function(cli) {
        writeBusterJsConfig(cli);
    }
});