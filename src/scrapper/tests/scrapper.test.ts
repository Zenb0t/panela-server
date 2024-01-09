import axios from "axios";
import { fetchHtml } from "../scrapper";

jest.mock("axios");

describe("fetchHtml", () => {
	it("should fetch HTML from a valid URL", async () => {
		const url = "https://example.com";
		const expectedHtml = "<html><body>Example HTML</body></html>";

		(axios.get as jest.Mock).mockResolvedValueOnce({ data: expectedHtml });

		const html = await fetchHtml(url);
		expect(html).toEqual(expectedHtml);
		expect(axios.get).toHaveBeenCalledWith(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
			},
		});
	});

	it("should return an empty string if URL is null", async () => {
		const url = null;
		const html = await fetchHtml(url);
		expect(html).toEqual("");
		expect(axios.get).not.toHaveBeenCalled();
	});

	it("should throw an error if there is an error fetching HTML", async () => {
		const url = "https://example.com";
		const error = new Error("Failed to fetch HTML");

		(axios.get as jest.Mock).mockRejectedValueOnce(error);

		await expect(fetchHtml(url)).rejects.toThrowError(error);
		expect(axios.get).toHaveBeenCalledWith(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
			},
		});
	});
});
