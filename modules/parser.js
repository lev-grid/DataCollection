(function() {
	const cheerio = require('cheerio');
	const pdfText = require('pdf-text');
	const WordExtractor = require("word-extractor");
	const mammoth = require("mammoth");
	const fs = require("fs");
	const tempfile = require('tempfile');

	var norm = str => str.replace(/\s+/g,' ').trim();
	var m2e = mime => {
		if (/^text\/html/i.test(mime)) return "html";
		if (mime == "application/pdf") return "pdf";
		if (mime == "application/msword") return "doc";
		if (mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
		return ""
	}

	module.exports.getLinks = function(buffer) {
		var $ = cheerio.load(buffer);
		return $("a[href]").map((_, el) => $(el).attr("href")).get();
	};
	module.exports.extractText = function(buffer, mime) {
		return new Promise((resolve, reject) => {
			switch (m2e(mime)) {
				case "html":
					var $ = cheerio.load(buffer);
					resolve(norm($('html').text()));
					break;
				case "pdf":
					pdfText(buffer, function(err, chunks) {
						if (err) reject(err);
						else resolve(norm(chunks.join(" ")));
					});
					break;
				case "doc":
					var file = tempfile(".doc");
					fs.writeFileSync(file, buffer);
					var extractor = new WordExtractor();
					resolve(extractor.extract(file).then(doc => {
						fs.unlinkSync(file);
						return norm(doc.getBody());
					}));
					break;
				case "docx":
					var doc = {buffer: buffer};
					resolve(mammoth.extractRawText(doc)
						.then(res => norm(res.value)));
					break;
				default:
					resolve("");
			}
		});
	};
})();