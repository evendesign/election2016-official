var electionTime = moment.tz("2016-01-16 08:00", "Asia/Taipei");

$('.countdown').countdown(electionTime.toDate()).on('update.countdown', function(event) {
  $(this).html(event.strftime(''
    + '<div class="item"><div class="number">%D</div><div class="unit">DAYS</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="number">%H</div><div class="unit">HOURS</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="number">%M</div><div class="unit">MINS</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="number">%S</div><div class="unit">SECS</div></div>'
  ));
}).on('finish.countdown', function(event) {
    console.log('finfsh');
});

$('.close-bar').on('click', function() {
    $('.election-countdown').remove();
});
$('.mask').on('click', function() {
    $('.election-countdown').remove();
});