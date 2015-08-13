$( document ).ready(function() {

  var desktop_breakpoint = 1025;

  if(Modernizr.csstransitions && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    var doc = $(document);
    var body = $('body');
    var page = $('.page');
    body.addClass('scale-content');

    function push_page(){
      push = 'translate(0,'+ (150 - $(window).height() + 'px') +')';
      page.css({
        "-webkit-transform": push,
        "transform": push
      });
      body.addClass('is-scaled');
    }
    function reset_page(){
      page.css({
        "-webkit-transform": 'none',
        "transform": 'none'
      });
      body.removeClass('is-scaled');
    }

    $(window).on('scroll', function(){
      var scrolling = doc.scrollTop();
      var touch_bottom = body.height() - $(window).height() - $('.site-info').outerHeight();
      if ( scrolling >= touch_bottom ) {
        var viewport_width = $(window).width();
        if (viewport_width >= desktop_breakpoint) {
          push_page();
        }
      } else {
        reset_page();
      }
    });

    $(window).resize(function() {
      var scrolling = doc.scrollTop();
      var touch_bottom = body.height() - $(window).height() - $('.site-info').outerHeight();
      var viewport_width = $(window).width();
      if (viewport_width < desktop_breakpoint ) {
        body.removeClass('scale-content');
        reset_page();
      } else if (viewport_width >= desktop_breakpoint && scrolling < touch_bottom) {
        body.addClass('scale-content');
        reset_page();
      } else {
        body.addClass('scale-content');
        push_page();
        $("html, body").scrollTop(doc.height());
      }
    });
  }

  $("a[href='#top']").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  if ( $('.back-to-top-wrap').length != 0 ) {
    function back_to_top_active() {
      var waypoints = $('.page-inner').waypoint({
        handler: function(direction) {
          $('.back-to-top-wrap').toggleClass('is-active');
        },
        offset: '-70%'
      })
    }
    back_to_top_active();
  }




  // open menu
  $('.menu-btn').on('click', function () {
    $('html').toggleClass('is-open-menu');
    $('.menu-btn').toggleClass('is-open-menu');
  });

  if ( $('.homepage').length != 0 ) {
    function sticky_active(targetClass, offsetAmount) {
      var target_class = $('.'+targetClass);
      var waypoints = new Waypoint.Sticky({
        element: target_class,
        stuckClass: 'sticky',
        offset: offsetAmount,
        wrapper:'<div class="'+targetClass+'-sticky-wrapper" />'
      })
    }

    sticky_active('header','0');
    sticky_active('sub-menu','62px');

    // hack sticky resize problem
    $(window).resize(function() {
      var viewport_width = $(window).width();
      if ( viewport_width > desktop_breakpoint ) {
        var headerOffset = $('.header').offset().top;
        var windowScrolltop = $(window).scrollTop();
        if ( windowScrolltop < headerOffset || headerOffset == 0 ) {
          $('.sticky').removeClass('sticky');
        } else if ( windowScrolltop > headerOffset) {
          $('.header').addClass('sticky');
        }
      }
    });
  }

  // hack destop resize to mobile menu fade-in animation
  $(window).resize(function() {
    var viewport_width = $(window).width();
    if (viewport_width < desktop_breakpoint ) {
      $('.menu').addClass('is-mobile').delay(300).queue(function(){
        $('.menu').removeClass('is-mobile').dequeue();
      });
    }
  });

});





