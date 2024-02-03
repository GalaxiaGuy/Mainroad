document.addEventListener('DOMContentLoaded', function() {
	addYoutubeListeners();

	let main = document.querySelectorAll('main')[0];

	let observer = new MutationObserver(function(mutations) {
		addYoutubeListeners();
	});

	observer.observe(main, {
		childList: true,
		subtree: true
	  });
});

function addYoutubeListeners() {
	let youtube = document.querySelectorAll('.youtube');
	for (let i = 0; i < youtube.length; i++) {
		let link = youtube[i].querySelectorAll('.thumbnail')[0];
		let iframe = youtube[i].querySelectorAll('iframe')[0];
		if (!iframe.hasAttribute('data-src')) {
			continue;
		}
		link.addEventListener('click', function(e) {
			iframe.setAttribute('src', iframe.getAttribute('data-src'));
			iframe.removeAttribute('data-src');
			iframe.style.display = 'block';
			e.preventDefault();
		});
	}
}



