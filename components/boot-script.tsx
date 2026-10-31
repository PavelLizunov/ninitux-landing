/**
 * Runs in <head> before the first paint. It picks the language and the
 * visitor's operating system and writes them to <html> as data-lang, data-os
 * and data-ostab, so the page never flashes the wrong language or the wrong
 * download button. Everything that depends on them is plain CSS in
 * globals.css; without JavaScript the page stays Russian with the Windows
 * download.
 *
 * ?lang=ru|en and ?os=win|mac|linux|omarchy|android|ios override the detection.
 * The existing #omarchy link opens the native plugin installation tab.
 */
const BOOT = `(function(){try{
var d=document.documentElement,n=navigator,q=new URLSearchParams(location.search);
var l=null;try{l=localStorage.getItem('ninitux_lang')}catch(e){}
var ql=q.get('lang');if(ql==='ru'||ql==='en')l=ql;
if(l!=='ru'&&l!=='en'){var ls=(n.languages&&n.languages.length?n.languages:[n.language||'']).join(',').toLowerCase();l=/(^|,)(ru|be|kk)/.test(ls)?'ru':'en'}
d.setAttribute('data-lang',l);d.setAttribute('lang',l);
var u=n.userAgent||'',o='win';
if(/Android/i.test(u))o='android';
else if(/iPhone|iPad|iPod/i.test(u)||(/Macintosh/i.test(u)&&n.maxTouchPoints>1))o='ios';
else if(/Windows/i.test(u))o='win';
else if(/Macintosh|Mac OS X/i.test(u))o='mac';
else if(/Linux|X11|CrOS/i.test(u))o='linux';
var qo=q.get('os');if(/^(win|mac|linux|android|ios)$/.test(qo||''))o=qo;
if(qo==='omarchy')o='linux';
d.setAttribute('data-os',o);d.setAttribute('data-ostab',qo==='omarchy'||location.hash==='#omarchy'?'omarchy':o==='ios'?'win':o);
}catch(e){}})();`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT }} />;
}
