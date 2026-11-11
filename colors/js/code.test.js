/**
 * @jest-environment jsdom
 */

const { saveCookie, addColor } = require("./code");

test("Unit: saveCookie writes firstName, lastName, and userId into document.cookie", () => {
	saveCookie();
	expect(document.cookie).toContain("firstName=");
	expect(document.cookie).toContain("lastName=");
	expect(document.cookie).toContain("userId=0");
});

test("Integration: addColor sends POST JSON payload to AddColor API and updates DOM on 200 response", () => {
	document.body.innerHTML = '<input id="colorText" value="Blue" /><span id="colorAddResult"></span>';

	const openMock = jest.fn();
	const sendMock = jest.fn(function () {
		this.readyState = 4;
		this.status = 200;
		this.onreadystatechange();
	});

	window.XMLHttpRequest = jest.fn(() => ({
		open: openMock,
		setRequestHeader: jest.fn(),
		send: sendMock
	}));

	addColor();

	expect(openMock).toHaveBeenCalledWith("POST", "/colors/LAMPAPI/AddColor.php", true);
	expect(JSON.parse(sendMock.mock.calls[0][0])).toEqual({ color: "Blue", userId: 0 });
	expect(document.getElementById("colorAddResult").innerHTML).toBe("Color has been added");
});
