import kit from "nokit";

export default (task, option) => {
    task("build", ["clean", "build-docs"], async () => {
        await kit.spawn("babel", ["src", "--out-dir", "lib"]);

        await kit.spawn("webpack", [
            "lib/browser.js", "dist/junit.js"
        ]);

        await kit.spawn("webpack", [
            "--module-bind", "js=babel?stage=0",
            "test/browser/index.js", "dist/test-basic.js"
        ]);
    });

    task("clean", () => kit.remove("{dist,lib}"));

    task("build-docs", "build readme.md", () =>
        kit.warp("src/**/*.js")
        .load(
            kit.drives.comment2md({ h: 2, tpl: "doc/readme.jst.md" })
        ).run()
    );

    task("lint", () =>
        kit.spawn("eslint", ["src", "test", "nofile.js"])
    );

    task("watch-test", "auto watch & reload test", (opts) => {
        return kit.monitorApp({
            bin: "babel-node",
            isNodeDeps: false,
            watchList: ["{src,test}/**/*.js"],
            args: [
                "node_modules/.bin/babel-istanbul", "cover",
                "src/cli.js", "--",
                "-g", opts.T, "test/*.js"
            ]
        });
    });

    option("-t <.*>", "unit test regex filter", ".*");
    task("test", ["lint"], async (opts) => {
        try {
            kit.spawn(
                "babel-node", [
                    "node_modules/.bin/babel-istanbul", "cover",
                    "src/cli.js", "--",
                    "-g", opts.T, "test/*.js"
                ]
            );
        } catch ({ code }) {
            process.exit(code);
        }
    });
};
