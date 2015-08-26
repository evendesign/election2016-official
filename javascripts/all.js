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
    // parallex scroll effect
    // if ( $('.pasc').length != 0 ) {
    //   function parallex_scroll() {
    //     var pascElements = $('.pasc')
    //     for (var i = 0; i < pascElements.length; i++) {
    //       new Waypoint({
    //         element: pascElements[i],
    //         handler: function(direction) {
    //           var target = this.element;
    //           $(window).on('scroll', function(){
    //             var windowScroll = $(window).scrollTop();
    //             var distance = (( windowScroll - window.innerHeight ) / window.innerHeight) * 100;
    //             if( distance > -100 && distance < 100) {
    //               $(target).css({
    //                 "-webkit-transform": "translateY(" + distance + "%)",
    //                 "-moz-transform": "translateY(" + distance + "%)",
    //                 "-ms-transform": "translateY(" + distance + "%)",
    //                 "-o-transform": "translateY(" + distance + "%)",
    //                 "transform": "translateY(" + distance + "%)"
    //               });
    //             }
    //           })
    //         },
    //         offset: '100%'
    //       })
    //     }
    //   }
    //   parallex_scroll();
    // }
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

  // policy animation js
  if ( $('.animation').length != 0 ) {
    function section_animation() {
      var animationElements = $('.animation')
      for (var i = 0; i < animationElements.length; i++) {
        new Waypoint({
          element: animationElements[i],
          handler: function(direction) {
            $(this.element).addClass('is-active')
          },
          offset: '75%'
        })
      }
    }
    section_animation();
  }
  // scroll-spy js
  if( $('.scroll-spy-section').length != 0 ) {
    function scroll_spy() {
      var spyItemElements = $('.scroll-spy-section');
      for ( var i = 0; i < spyItemElements.length; i++) {
        new Waypoint({
          element: spyItemElements[i],
          handler: function(direction) {
            var spyMenuElements = $('.scroll-spy-menu-item');
            var target = spyMenuElements[this.element.getAttribute("data-spy-index") - 1];
            var previousTarget = spyMenuElements[this.element.getAttribute("data-spy-index") - 2];
            if ( direction === 'down' ) {
              spyMenuElements.removeClass('is-active');
              $(target).addClass('is-active');
            }
            if ( direction === 'up' ) {
              spyMenuElements.removeClass('is-active');
              $(previousTarget).addClass('is-active');
            }
          },
          offset: '50%'
        })
      }
    }
    scroll_spy();
  }
  $('.scroll-spy-menu-item a').on('click',function (e) {
    e.preventDefault();

    var target = this.hash,
    $target = $(target);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top - 110
    }, 1000, 'swing', function () {
        window.location.hash = target;
    });
  });
});





