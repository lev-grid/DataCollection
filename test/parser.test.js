const assert = require("assert");
const fs = require("fs");
const parser = require("../modules/parser");
const path = "test\\data\\";

describe("Module #1 (Parser):", function(){
	this.timeout(0);
	this.slow(1000);
	describe("getLinks:", function() {
		for (let i = 1; i <= 5; ++i) {
			it(`get links from HTML #${i}`, function() {
				var str = fs.readFileSync(`${path}html\\out${i}l.txt`, "utf8");
				var expected = (str !== "") ? str.split(/\r?\n/).sort() : [];
				var file = fs.readFileSync(`${path}html\\inp${i}.html`);
				var actual = parser.getLinks(file).sort();
				assert.deepEqual(actual, expected);
			});
		}
	});
	describe("extractText:", function() {
		describe("html:", function() {
			for (let i = 1; i <= 5; ++i) {
				it(`extract text from HTML #${i}`, function() {
					var expected = fs.readFileSync(`${path}html\\out${i}t.txt`, "utf8");
					var file = fs.readFileSync(`${path}html\\inp${i}.html`);
					return parser.extractText(file, "text/html; charset=utf-8").then(actual => {
						assert.deepEqual(actual, expected);
					})
				});
			}
		});
		describe("pdf:", function() {
			for (let i = 1; i <= 5; ++i) {
				it(`extract text from PDF #${i}`, function() {
					var expected = fs.readFileSync(`${path}pdf\\out${i}.txt`, "utf8");
					var file = fs.readFileSync(`${path}pdf\\inp${i}.pdf`);
					return parser.extractText(file, "application/pdf").then(actual => {
						assert.deepEqual(actual, expected);
					});
				});
			}
		});
		describe("doc:", function() {
			for (let i = 1; i <= 5; ++i) {
				it(`extract text from DOC #${i}`, function() {
					var expected = fs.readFileSync(`${path}doc\\out${i}.txt`, "utf8");
					var file = fs.readFileSync(`${path}doc\\inp${i}.doc`);
					return parser.extractText(file, "application/msword").then(actual => {
						assert.deepEqual(actual, expected);
					});
				});
			}
		});
		describe("docx:", function() {
			for (let i = 1; i <= 5; ++i) {
				it(`extract text from DOCX #${i}`, function() {
					var expected = fs.readFileSync(`${path}docx\\out${i}.txt`, "utf8");
					var file = fs.readFileSync(`${path}docx\\inp${i}.docx`);
					var mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					return parser.extractText(file, mime).then(actual => {
						assert.deepEqual(actual, expected);
					});
				});
			}
		});
	});
});