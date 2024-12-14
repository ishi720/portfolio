$(function () {
  $(".works__link").hover(function () {
    $(this).css("transition", "0.2s");
  });
  $(window).scroll(function () {
    $(".skills__circle").each(function () {
      var i = $(this);
      t = $(this).offset().top;
      if ($(window).scrollTop() > t - $(window).height() + 150) {
        setTimeout(function () {
          $(i).is('[data-progress="90"]') &&
            $(i).addClass("skills__circle-90").addClass("skills__circle-max"),
            $(i).is('[data-progress="80"]') &&
              $(i).addClass("skills__circle-80").addClass("skills__circle-max"),
            $(i).is('[data-progress="70"]') &&
              $(i).addClass("skills__circle-70").addClass("skills__circle-max"),
            $(i).is('[data-progress="60"]') &&
              $(i).addClass("skills__circle-60").addClass("skills__circle-max"),
            $(i).is('[data-progress="50"]') &&
              $(i).addClass("skills__circle-50"),
            $(i).is('[data-progress="40"]') &&
              $(i).addClass("skills__circle-40"),
            $(i).is('[data-progress="30"]') &&
              $(i).addClass("skills__circle-30");
        }, 500);
      }
    });
  });

  $(".skills__circle").hover(
    function () {
      $(this).find(".skill_per").fadeIn();
    },
    function () {
      $(this).find(".skill_per").fadeOut();
    }
  );

  $('a[href^="#"]').click(function () {
    var section = $(this).attr("href");
    i = $("#" == section || "" == section ? "html" : section);
    top_ = i.offset().top - 40;
    return $("body,html").animate({ scrollTop: top_ }, 400, "swing");
  });

  $(".wrapper").hide().fadeIn(1000);

  var $allMsg = $(".top__title");
  var $wordList = $(".top__title").html().split("");
  $(".top__title").html("");
  $.each($wordList, function (idx, elem) {
    var newEL = $("<span/>").text(elem).css({ opacity: 0 });
    newEL.appendTo($allMsg);
    newEL.delay(idx * 100);
    newEL.animate({ opacity: 1 }, 1100);
  });

  function fadein_blocks(s) {
    $(window).scroll(function () {
      $(s).each(function (s) {
        var i = $(this).offset().top;
        $(window).scrollTop() > i - $(window).height() + 200 &&
          $(this)
            .delay(300 * s)
            .queue(function () {
              $(this).addClass("is-fadein");
            });
      });
    });
  }
  !(function (s) {
    $(window).scroll(function () {
      $(s).each(function () {
        var s = $(this).offset().top;
        $(window).scrollTop() > s - $(window).height() + 200 &&
          $(this).addClass("is-fadein");
      });
    });
  })(".js-fadein");

  fadein_blocks(".service__block");
  fadein_blocks(".works__link");
});
