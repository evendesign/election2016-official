$(window).load(function(){
  if ( $('.election-countdown').length != 0 ) {
    var electionTime = moment.tz("2016-01-16 08:00", "Asia/Taipei");
    var countdownWindow = $('.election-countdown');
    var body = $('body');

    body.addClass('ad-in');

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

    $('.close-bar .countinue-to-iing, .close-bar .button, .election-countdown .mask').on('click', function() {
        body.removeClass('ad-in').addClass('ad-out');
        setTimeout(function(){
          countdownWindow.remove();
        },600)
    });
  }
});