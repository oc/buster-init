var buster = require("buster-core");
var busterCli = require("buster-cli");
var prettyJson = require("buster-format").ascii;
var fs = require("fs");

var detecter = {
    detect: function(project, prefix) {
        return "plain";
    }
};

function initWithConfig(cli) {
    var style = cli.bdd.isSet ? 'spec' : 'test';
    var prefix = cli.prefix.isSet ? cli.prefix.value : '.';
        
    var project = detecter.detect(cli.project.value, prefix);
    
    console.log("project: " + project + " style: " + style + " prefix: " + prefix);
    writeConfig(cli, buildConfig(project, prefix, style))
}


// TODO: Move to project provider?
function buildConfig(_project, _prefix, _style) {
    switch(_project) {
        case 'plain':
            return {
                project: _project,
                prefix: _prefix,
                style: _style,
                srcPath: 'src',
                testPath: _style,
                libPath: 'lib'
            };
        case 'maven':
            return { 
                project: _project,
                prefix: _prefix,
                style: _style,
                srcPath: 'src/main/webapp/lib',
                testPath: 'src/test/javascript',
                libPath: 'src/main/webapp/lib-external'                
            };
    }
    throw e;
}

// TODO: Generalize?
function writeConfig(cli, cfg) {
    fs.writeFile(cfg.prefix + '/buster2.js',
        "var config = module.exports;\n\n" +
        "config['Browser tests'] = {\n" +
        "    environment: 'browser',\n" +
        "    libs:        ['" + cfg.libPath  + "/**/*.js'],\n" +
        "    sources:     ['" + cfg.srcPath  + "/**/*.js'],\n" +
        "    tests:       ['" + cfg.testPath +"/" + cfg.style + "-helper.js', '" + cfg.testPath + "/**/*-" + cfg.style + ".js']\n" +
        "};\n", 
        function (err) {
            if (err) throw err;
            cli.logger.info('Wrote config.');
        }
    );
}

module.exports = buster.extend(busterCli.create(), {
    loadOptions: function() {
        this.project = this.opt("-p", "--project", "Type of project: plain, rails, maven, sbt. Will try to detect by default.", ['plain', 'rails', 'maven', 'sbt'], {
            hasValue: true,
            defaultValue: undefined
        });
                
        this.bdd = this.opt("-s", "--spec", "Use BDD style specs instead of xUnit", {
        });

        this.prefix = this.opd("<path to project>", "Prefix path to project to initialize. Defaults to current working directory.");
    },
    onRun: function() {
        var self = this;
        
        if (typeof this.findConfigFile(process.cwd()) !== 'undefined') {
            self.logger.error("Found config file: " + this.findConfigFile(process.cwd()) + ", is the project already initialized?");            
        }
        
        initWithConfig(this);
    }
});