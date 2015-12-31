var electionTime = moment.tz("2016-01-16 08:00", "Asia/Taipei");

$('.countdown').countdown(electionTime.toDate()).on('update.countdown', function(event) {
  $(this).html(event.strftime(''
    + '<div class="item"><div class="unit">DAYS</div><div class="number">%D</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="unit">HOURS</div><div class="number">%H</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="unit">MINS</div><div class="number">%M</div></div>'
    + '<div class="colon">：</div>'
    + '<div class="item"><div class="unit">SECS</div><div class="number">%S</div></div>'
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