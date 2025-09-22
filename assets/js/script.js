$(function () {
  setArticle();
  $(".works__link").hover(function () {
    $(this).css("transition", "0.2s");
  });
  $(".articles__link").hover(function () {
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
              $(i).addClass("skills__circle-30"),
            $(i).is('[data-progress="20"]') &&
              $(i).addClass("skills__circle-20"),
            $(i).is('[data-progress="10"]') &&
              $(i).addClass("skills__circle-10");
        }, 500);
      }
    });
  });

  $(".skills__circle").on("mouseenter mouseleave", function () {
    $(this).find(".skill_per").fadeToggle();
  });

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


function setArticle() {
  const url = "./assets/json/combined_articles.json";
  fetch(url).then(response => {
    if (!response.ok) {
      throw new Error("ネットワークエラー: " + response.status);
    }
    return response.json();
  }).then(data => {

    $('#articles__source_1').text(data[0]['source']);
    $('#articles__title_1').text(data[0]['title']);
    $('#articles__link_1').attr('href', data[0]['url']);
    $('#articles__likes_1').text(data[0]['likes']);

    const array1 = data[0]['tags'].split(",").map(item => item.trim());
    array1.forEach(tag => {
      $("#articles__tags_1").append('<span class="articles__tag">'+ tag +'</span>\n');
    });

    $('#articles__source_2').text(data[1]['source']);
    $('#articles__title_2').text(data[1]['title']);
    $('#articles__link_2').attr('href', data[1]['url']);
    $('#articles__likes_2').text(data[1]['likes']);

    const array2 = data[1]['tags'].split(",").map(item => item.trim());
    array2.forEach(tag => {
      $("#articles__tags_2").append('<span class="articles__tag">'+ tag +'</span>\n');
    });

    $('#articles__source_3').text(data[2]['source']);
    $('#articles__title_3').text(data[2]['title']);
    $('#articles__link_3').attr('href', data[2]['url']);
    $('#articles__likes_3').text(data[2]['likes']);

    const array3 = data[2]['tags'].split(",").map(item => item.trim());
    array3.forEach(tag => {
      $("#articles__tags_3").append('<span class="articles__tag">'+ tag +'</span>\n');
    });

    $('#articles__source_4').text(data[3]['source']);
    $('#articles__title_4').text(data[3]['title']);
    $('#articles__link_4').attr('href', data[3]['url']);
    $('#articles__likes_4').text(data[3]['likes']);

    const array4 = data[3]['tags'].split(",").map(item => item.trim());
    array4.forEach(tag => {
      $("#articles__tags_4").append('<span class="articles__tag">'+ tag +'</span>\n');
    });

    $('#articles__source_5').text(data[4]['source']);
    $('#articles__title_5').text(data[4]['title']);
    $('#articles__link_5').attr('href', data[4]['url']);
    $('#articles__likes_5').text(data[4]['likes']);

    const array5 = data[4]['tags'].split(",").map(item => item.trim());
    array5.forEach(tag => {
      $("#articles__tags_5").append('<span class="articles__tag">'+ tag +'</span>\n');
    });

    $('#articles__source_6').text(data[5]['source']);
    $('#articles__title_6').text(data[5]['title']);
    $('#articles__link_6').attr('href', data[5]['url']);
    $('#articles__likes_6').text(data[5]['likes']);

    const array6 = data[5]['tags'].split(",").map(item => item.trim());
    array6.forEach(tag => {
      $("#articles__tags_6").append('<span class="articles__tag">'+ tag +'</span>\n');
    });
  }).catch(error => {
    console.error("エラーが発生しました:", error);
  });
}