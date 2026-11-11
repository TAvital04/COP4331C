/**
 * @jest-environment jsdom
 */

const { saveCookie } = require("./code");

test("saveCookie writes firstName, lastName, and userId into document.cookie", () => {
	saveCookie();
	expect(document.cookie).toContain("firstName=");
	expect(document.cookie).toContain("lastName=");
	expect(document.cookie).toContain("userId=0");
});
