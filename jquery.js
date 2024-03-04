// Tämä tekee pelin käytöstä paremman, kun kuvat ei jää kiinni hiireen eikä myöskään tekstiä voi maalata

$(document).ready(function() {

    // disabling text highlight on all browser    
    $('body').each(function(){
        $(this).css({
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        });
    });

    // disabling cut, copy, paste of DOM elements
    $(document).bind('cut copy paste', function(event) {
        event.preventDefault();
    });

    // disabling image dragging
    $('img').bind('mousedown selectstart', function(event) {
        event.preventDefault();
    });

});

// disabling right click completelly
function mischandler(){
    return false;
}
function mousehandler(e){
    var myevent = (isNS) ? e : event;
    var eventbutton = (isNS) ? myevent.which : myevent.button;
    if((eventbutton==2)||(eventbutton==3)) return false;
}
var isNS = (navigator.appName == "Netscape") ? 1 : 0;
if(navigator.appName == "Netscape") {
    document.captureEvents(Event.MOUSEDOWN||Event.MOUSEUP);
}
document.oncontextmenu = mischandler;
document.onmousedown = mousehandler;
document.onmouseup = mousehandler;