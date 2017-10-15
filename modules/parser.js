const cheerio = require('cheerio');
const pdfText = require('pdf-text');
const WordExtractor = require("word-extractor");
const mammoth = require("mammoth");
const fs = require("fs");
const tempfile = require('tempfile');

module.exports.extractText   = extractText   = function(str, mime) {
	if (mime == "text/html" || mime == "html") {
		return new Promise(function(resolve, reject) {
			resolve(textFromHTML(str));
		});
	}
	if (mime == "application/pdf" || mime == "pdf") {
		return textFromPDF(str);
	}
	if (mime == "application/msword" || mime == "doc") {
		return textFromDOC(str);
	}
	if (mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mime == "docx") {
		return textFromDOCX(str);
	}
};
module.exports.textFromHTML  = textFromHTML  = function(str) {
	var $ = cheerio.load(str);
	return $('html').text().replace(/\s+/g,' ').trim();
};
module.exports.linksFromHTML = linksFromHTML = function(str) {
	var $ = cheerio.load(str);
	return $("a[href]").map((_, el) => $(el).attr("href")).get();
};
module.exports.textFromPDF   = textFromPDF   = function(str) {
	return new Promise(function (resolve, reject) {
		pdfText(str, function(err, chunks) {
			if (err) reject(err);
			else resolve(chunks.join(" ").replace(/\s+/g,' ').trim());
		})
	});
};
module.exports.textFromDOC   = textFromDOC   = function(str) {
	var file = tempfile(".doc");
	fs.writeFileSync(file, str);
	var extractor = new WordExtractor();
	return extractor.extract(file).then(doc => {
		fs.unlinkSync(file);
		return doc.getBody().replace(/\s+/g,' ').trim();
	});
};
module.exports.textFromDOCX  = textFromDOCX  = function(str) {
	return mammoth.extractRawText({buffer: str}).then(function(result){
		return result.value.replace(/\s+/g,' ').trim();
	});
};