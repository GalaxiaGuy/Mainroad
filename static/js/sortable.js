document.addEventListener("click",function(c){try{function f(a,b){return a.nodeName===b?a:f(a.parentNode,b)}var x=c.shiftKey||c.altKey,d=f(c.target,"TH"),m=f(d,"TR"),g=f(m,"TABLE");function n(a,b){a.classList.remove("dir-d");a.classList.remove("dir-u");b&&a.classList.add(b)}function p(a){return x&&a.dataset.sortAlt||a.dataset.sort||a.textContent}if(g.classList.contains("sortable")){var q,e=m.cells,r=parseInt(d.dataset.sortTbr);for(c=0;c<e.length;c++)e[c]===d?q=parseInt(d.dataset.sortCol)||c:n(e[c],
	"");e="dir-d";if(d.classList.contains("dir-d")||g.classList.contains("asc")&&!d.classList.contains("dir-u"))e="dir-u";n(d,e);var t="dir-u"===e,v=function(a,b,h){var u=p((t?a:b).cells[h]);a=p((t?b:a).cells[h]);b=u.includes('-')?NaN:(parseFloat(u)-parseFloat(a));return isNaN(b)?u.localeCompare(a):b};for(c=0;c<g.tBodies.length;c++){var k=g.tBodies[c],w=[].slice.call(k.rows,0);w.sort(function(a,b){var h=v(a,b,q);return 0!==h||isNaN(r)?h:v(a,b,r)});var l=k.cloneNode();l.append.apply(l,w);g.replaceChild(l,k)}}}catch(f){}});


document.querySelectorAll('.content table').forEach((element) => {
	element.classList.add('sortable');
});
