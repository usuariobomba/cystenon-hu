var TestSlider;




function validInp(Val, id){
    if(Val == 0){
        $("#"+id).addClass("error");
        $("#"+id).addClass("thumb");
        setTimeout(function(){  $("#"+id).removeClass('thumb');},2000)
        return true;
    }

        $("#"+id).removeClass("error");

}
function validateEmail(email, id) {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var goid = reg.test(email);

    if(goid){

        validInp(1, id);
        return true
    }
    else
    {

        validInp(0, id);
        return false
    }


}

  function inputlen(A,B) {
        if (A < 2 || $("#" + B).val() == $("#" + B).attr('placeholder')) {
            validInp(0, B);
            return false;
        }
        else {
            validInp(1, B);
            return true;
        }
    }

    function ValidPhone(phone,ajdi) {
        var retel = /^[\d]+[\d\(\)\ -]+[\d]+$/;
        if (retel.test(phone)){
            $("#"+ajdi).removeClass("error");
            $("#"+ajdi).addClass("succes");
        }
        else{
            $("#"+ajdi).addClass("error");
        }
        return retel.test(phone);
    }


//testjs



function MyTest() {
    var answerYes = 0;

    this.checkQuest = function(Wrapper){

        var radioElem = $(Wrapper).find('input:radio:checked');

        if(radioElem.length != 0){
            $(Wrapper).removeClass('error');
            var Rvalue = radioElem.val();
            if(Rvalue == 1){
                answerYes++;
                console.log(answerYes);
                return true;
            }

            return true
      }


        $(Wrapper).addClass('error');
        setTimeout(function(){ $(Wrapper).removeClass('error');},2000)
    }
    this.getResult = function(){
        return answerYes;
    }

    this.getCountAnswers = function() {
        return answerYes;
    };
    this.resetAnsw = function(){answerYes = 0;}


}

var Mymytest = new MyTest();



//testjs
$(function () {

    $('.js-show-quest').on('touchend, click', function(){
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');


    });



    $('.js-begintest').on('touchend, click', function(){
        var VALID = inputlen($('#AGE').val().length,"AGE");

        var Wrapper = $(this).closest('li');

            var CHECK = 0;
            var radioElem = $(Wrapper).find('input:radio:checked');
            if(VALID){CHECK++;}
            if(radioElem.length != 0){
                $(Wrapper).removeClass('error');
                var Rvalue = radioElem.val();
                CHECK++;

                if(Rvalue == "M"){
                    console.log("M");
                }
                else{
                    console.log("J");
                }

            }
            else{
                $(Wrapper).addClass('error');
                setTimeout(function(){ $(Wrapper).removeClass('error');},2000)
            }

        console.log(CHECK);






        if(CHECK == 2){
            TestSlider.goToNextSlide();

        }
    });



    $('.js-checkanswer').on('change',function(){
        var CheckSlide = Mymytest.checkQuest($(this).closest('li'));

        if(CheckSlide){
            TestSlider.goToNextSlide();
            //$('.number-slide span').html(parseInt($('.number-slide span').html())+1);
            return false;
        }

    })


    $('.setQuest').on('touchend, click',function(){
      var IDFORM = $(this).attr('data-href');
        var QUEST = $(this).attr('data-quest');
        $(IDFORM).find('input[name="IDFORM"]').val(QUEST);

    })


    $('.jsResetTest').on('touchend, click', function(){
        Mymytest.resetAnsw();
        Mymytest.getCountAnswers();
        $('.number-slide span').html(1);

        $('.testblock input[type="radio"]').removeAttr("checked").trigger('refresh');
        TestSlider.goToSlide(0);
    });





    $('.js-getResult').on('change', function(){
        $('.showloader').fadeIn();

        var CheckSlide = Mymytest.checkQuest($(this).closest('li'));
        setTimeout(function(){$('.showloader').fadeOut();}, 2000);

        if($(this).hasClass('respad')){
            setTimeout(function(){
                $('.wrapper').addClass('custom2');
                $('.testblock').css('padding-top',0);

            }, 1000);

        }


        setTimeout(function(){

            if(CheckSlide){
                var valCheck = Mymytest.getResult();
                console.log(valCheck);
                switch (valCheck) {
                    case 0:
                        $('.resheader').html('A cisztitisz alacsony esélye');
                        $('.restext').html('Ne felejtsük el a szezonális megelőzést<br> с <span><b>Cystenon</b></span>');
                        break;
                    case 1:
                        $('.resheader').html('A cystitis átlagos valószínűsége');
                        $('.restext').html('Prevenciós tanfolyam ajánlott <span><b>Cystenon</b></span>.');
                        break;
                    case 2:
                        $('.resheader').html('A cisztitisz nagy valószínűsége');
                        $('.restext').html('Rendszeres tanfolyamok ajánlottak <span><b>Cystenon</b></span><br> Évente 3-4-szer.');
                        break;
                    default:
                        $('.resheader').html('A cisztitisz nagy valószínűsége');
                        $('.restext').html('Rendszeres tanfolyamok ajánlottak <span><b>Cystenon</b></span><br>  Évente 3-4-szer.');
                        break;
                }

                TestSlider.goToNextSlide();

                //$('.number-slide span').html(10);


            }
        }, 400);






    });

  

    $('input[placeholder], textarea[placeholder]').placeholder();

    $('input,textarea').focus(function(){
        $(this).data('placeholder',$(this).attr('placeholder'))
        $(this).attr('placeholder','');
    });
    $('input,textarea').blur(function(){
        $(this).attr('placeholder',$(this).data('placeholder'));
    });



    var TestSlider =   $('.testslider').bxSlider({
        pager: false,
        controls: false,
        auto: false,
        infiniteLoop: false,
        adaptiveHeight: true,
        touchEnabled: false,

            onSlideBefore: function($slideElement, oldIndex, newIndex){
                $('.number-slide span').html(newIndex);
            }

    });


    $('.bxaptects').bxSlider({
        pager: false,
        controls: true,
        auto: false,
        slideWidth: 190,
        minSlides: 5,
        maxSlides: 5,
        slideMargin: 0,
        moveSlides: 1

    });


    $('input[type="radio"]').styler(
        {
            wrapper: 'div.radio-buttons'
        }
    );
    $('select').styler();


    $('.clearform').on('touchend, click', function(e) {

        var elem = $(this).attr('data-href');
        $(elem).find('textarea').val('');
        $(elem).find('input[type="text"], input[type="number"] ').val('');
        $(elem).find('.gonextbutton').addClass('active').removeClass('succes');

    });

    $(".rel-photos").on('touchend, click', function(e){

        $.fancybox($(this).attr('data-href'),{

            openEffect  : 'elastic',
            closeEffect : 'elastic',
            padding: 0,
            scrollOutside: true,

            autoScale: false,
            helpers: {
                overlay: {
                    locked : false
                }
            }
        });

    })

    $(".rel-fancy").on('touchend, click', function(e) {

        $.fancybox($(this).attr('data-href'), {
            openEffect: 'elastic',
            closeEffect: 'elastic',
            padding: 0,

            helpers: {
                overlay: {
                    locked: false
                }
            }
        });

    });

});

$(document).ready(function() {
  var slider = $(".review-slider"); //$(".home-highlights > .row")
  slider.find("> div").removeClass("col-sm-4");
  
  var windowWidth = $(window).width();
  var breaks = [
    { screen: 0, slides: 1 },
    { screen: 992, slides: 2 }
  ];
  var settings = {
    pager: true,
    controls: false,
    auto: false,
    slideWidth: 310,
    minSlides: 3,
    maxSlides: 3,
    slideMargin: 10,
    moveSlides: 1,
    slideMargin: 10,
    onSliderResize: function() {
      init(true);
    }    
  };

  function init(isReload) {
    // screen width we will be referring to
    var currentWidth = $(window).width();
    windowWidth = currentWidth;

    // calculates slide width
    function calcSlideWidth(fullW, numSlides, margin) {
      var calcWidth = (fullW - margin * (numSlides - 1)) / numSlides;
      return Math.floor(calcWidth);
    }

    // sets break point options
    function setBreakOptions(breakObj) {
      for (var key in breakObj) {
        settings[key] = breakObj[key];
      }
    }

    // Sort in ascending order in case of mix up
    breaks.sort(function(a, b) {
      return a.screen - b.screen;
    });

    // Process breaks
    for (var i = 0; i < breaks.length; ++i) {
      var currentBreak = breaks[i];
      var nextBreak = {};
      var min = currentBreak.screen;
      var max;

      if (i < breaks.length - 1) {
        // next break exists
        nextBreak = breaks[i + 1];
        max = nextBreak.screen;
        if (currentWidth >= min && currentWidth < max) {
          setBreakOptions(currentBreak);
        }
      } else {
        // just use current break coz next one does not exist
        if (currentWidth >= min) {
          setBreakOptions(currentBreak);
        }
      }
    }

    if (settings.slides) {
      settings.maxSlides = settings.slides;
      settings.minSlides = settings.slides;
      settings.slideWidth = calcSlideWidth(
        windowWidth,
        settings.slides,
        settings.slideMargin
      );
    }

    console.log(settings.maxSlides, settings.slideWidth);
  
    if (isReload) {
      slider.reloadSlider(settings);  
    } else {
      slider.bxSlider(settings);
    }    
  }

  init();
  
});
