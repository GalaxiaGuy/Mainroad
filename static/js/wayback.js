Date.prototype.yyyymmdd = function() {
	var mm = this.getMonth() + 1; // getMonth() is zero-based
	var dd = this.getDate();

	return [this.getFullYear(),
			(mm>9 ? '' : '0') + mm,
			(dd>9 ? '' : '0') + dd
		   ].join('');
  };

document.addEventListener('DOMContentLoaded', function() {
	let articles = document.querySelectorAll('article');
	for (let i = 0; i < articles.length; i++) {
		let article = articles[i];
		let wayback = article.querySelectorAll('.wayback')[0];
		let links = article.querySelectorAll('article .post__content a');

		if (links.length == 0) {
			wayback.remove();
			break;
		}

		let time = article.querySelectorAll('time')[0];
		let waybackTime = new Date(time.dateTime)
		let waybackList = wayback.querySelectorAll('ol')[0];

		var added = false;

		for (let i = 0; i < links.length; i++) {
			let url = new URL(links[i].href)
			// check if url cost contains "localhost"
			if (url.host.indexOf('localhost') != -1) {
				continue;
			}
			if (url.host == window.location.host) {
				continue;
			}
			if (links[i].textContent.trim() == '') {
				continue;
			}

			var postWarning = links[i].closest('.post__warning');

			if (postWarning != null) {
				continue;
			}

			waybackList.innerHTML += '<li><a href="https://web.archive.org/web/' + waybackTime.yyyymmdd() + '/' + links[i].href + '" target="_blank">' + links[i].textContent + '</a></li>';
			added = true;
		}
		if (!added) {
			wayback.remove();
			break;
		}

	}
});
