var electionTime = moment.tz("2016-01-16 08:00", "Asia/Taipei");
var countdownWindow = $('.election-countdown');
var body = $('body');

$('.countdown').countdown(electionTime.toDate()).on('update.countdown', function(event) {
  $(this).html(event.strftime(''
    + '<div class="item"><div class="number">%D</div><div class="unit">days</div></div>'
    + '<div class="item"><div class="number">%H</div><div class="unit">hours</div></div>'
    + '<div class="item"><div class="number">%M</div><div class="unit">mins</div></div>'
    + '<div class="item"><div class="number">%S</div><div class="unit">secs</div></div>'
  ));
}).on('finish.countdown', function(event) {
    countdownWindow.remove();
});

$(window).load(function(){
  body.addClass('ad-in');
});

$('.close-bar .countinue-to-iing, .close-bar .button, .election-countdown .mask').on('click', function() {
    body.removeClass('ad-in').addClass('ad-out');
    countdownWindow.addEventListener("transitionend", removeCountdown, false);
});

function removeCountdown() {
    countdownWindow.remove();
}