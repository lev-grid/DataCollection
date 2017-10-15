const assert = require("assert");
const fs = require("fs");
const parser = require("../modules/parser");
const path = "test\\data\\";
describe("Module #1 (Parser):", function(){
	this.timeout(0);
	this.slow(10000);
	describe("HTML files:", function() {
		for (let i = 1; i <= 5; ++i) {
			it(`extract text from HTML #${i}`, function() {
				var expected = fs.readFileSync(`${path}html\\out${i}t.txt`, "utf8");
				var file = fs.readFileSync(`${path}html\\inp${i}.html`);
				var actual = parser.textFromHTML(file);
				assert.deepEqual(actual, expected);
			});
		}
		for (let i = 1; i <= 5; ++i) {
			it(`extract links from HTML #${i}`, function() {
				var str = fs.readFileSync(`${path}html\\out${i}l.txt`, "utf8");
				var expected = (str !== "") ? str.split(/\r?\n/).sort() : [];
				var file = fs.readFileSync(`${path}html\\inp${i}.html`);
				var actual = parser.linksFromHTML(file).sort();
				assert.deepEqual(actual, expected);
			});
		}
	});
	describe("PDF files:", function() {
		for (let i = 1; i <= 5; ++i) {
			it(`extract text from PDF #${i}`, function() {
				var expected = fs.readFileSync(`${path}pdf\\out${i}.txt`, "utf8");
				var file = fs.readFileSync(`${path}pdf\\inp${i}.pdf`);
				return parser.textFromPDF(file).then(actual => {
					assert.deepEqual(actual, expected);
				});
			});
		}
	});
	describe("DOC files:", function() {
		for (let i = 1; i <= 5; ++i) {
			it(`extract text from DOC #${i}`, function() {
				var expected = fs.readFileSync(`${path}doc\\out${i}.txt`, "utf8");
				var file = fs.readFileSync(`${path}doc\\inp${i}.doc`);
				return parser.textFromDOC(file).then(actual => {
					assert.deepEqual(actual, expected);
				});
			});
		}
	});
	describe("DOCX files:", function() {
		for (let i = 1; i <= 5; ++i) {
			it(`extract text from DOCX #${i}`, function() {
				var expected = fs.readFileSync(`${path}docx\\out${i}.txt`, "utf8");
				var file = fs.readFileSync(`${path}docx\\inp${i}.docx`);
				return parser.textFromDOCX(file).then(actual => {
					assert.deepEqual(actual, expected);
				});
			});
		}
	});
});