import junit from "../src";
import yutils from "yaku/lib/utils";

let it = junit();

it.async([

    it("all passed", () => {
        let test = junit({ isThrowOnFinal: false });

        // Async tests
        return test.async([
            test("basic 1", () =>
                it.eq("ok", "ok")
            ),
            test("basic 2", () =>
                it.eq({ a: 1, b: 2 }, { a: 1, b: 2 })
            ),

            // Sync tests
            yutils.flow([
                test("basic 3", () =>
                    it.eq("ok", "ok")
                ),
                test("basic 4", () =>
                    it.eq("ok", "ok")
                )
            ])
        ])
        .then(({ passed }) =>
            it.eq(4, passed)
        );
    }),

    it("type check", () => {
        let test = junit({ isThrowOnFinal: false });

        let tests = [
            "string",
            1,
            undefined,
            null,
            { a: { b: { c: "test" } } },
            new Buffer("test")
        ].map((v, i) => test(`type ${i}`, () => it.eq(v, v)));

        return test.async(tests)
        .then(({ passed }) =>
            it.eq(tests.length, passed)
        );
    }),

    it("failed", () => {
        let test = junit({ isThrowOnFinal: false });

        // Async tests
        return test.async([
            test("basic 1", () =>
                it.eq("ok", "ok")
            ),
            test("basic 2", () =>
                it.eq("ok", "ok1")
            ),
            test("basic 3", () =>
                it.eq({ a: 1, b: 2 }, { a: 1, b: 2 })
            )
        ])
        .then(({ failed }) =>
            it.eq(1, failed)
        );
    })
]);