$(function() {

    /********
     Calendar
     *********/

    function Calendar(month, year) {
        var now = new Date();

        // labels for week days and months
        var days_labels = ['пон.', 'вт.', 'ср.', 'чет.', 'пят.', 'суб.', 'вск.'],
            months_labels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        // test if input date is correct, instead use current month
        this.month = (isNaN(month) || month == null) ? now.getMonth() + 1 : month;
        this.year = (isNaN(year) || year == null) ? now.getFullYear() : year;

        var logical_month = this.month - 1;

        // get first day of month and first week day
        var first_day = new Date(this.year, logical_month, 1),
            first_day_weekday = first_day.getDay() == 0 ? 7 : first_day.getDay();

        // find number of days in month
        var month_length = new Date(this.year, this.month, 0).getDate(),
            previous_month_length = new Date(this.year, logical_month, 0).getDate();

        // calendar header
        var html = '<p class="calendar-header">' + months_labels[logical_month] + '</p>';

        // calendar content
        html += '<table class="calendar-table">';

        // week days labels row
        html += '<thead>';
        html += '<tr class="week-days">';
        for (var i = 0; i <= 6; i++) {
            html += '<th class="day">';
            html += days_labels[i];
            html += '</th>';
        }
        html += '</tr>';
        html += '</thead>';

        // define default day variables
        var day  = 1, // current month days
            prev = 1, // previous month days
            next = 1; // next month days

        html += '<tbody>';
        html += '<tr class="week">';
        // weeks loop (rows)
        for (var i = 0; i < 9; i++) {
            // weekdays loop (cells)
            for (var j = 1; j <= 7; j++) {
                if (day <= month_length && (i > 0 || j >= first_day_weekday)) {
                    // current month
                    html += '<td class="day">';
                    html += day;
                    html += '</td>';
                    day++;
                } else {
                    if (day <= month_length) {
                        // previous month
                        html += '<td class="day other-month">';
                        html += previous_month_length - first_day_weekday + prev + 1;
                        html += '</td>';
                        prev++;
                    } else {
                        // next month
                        html += '<td class="day other-month">';
                        html += next;
                        html += '</td>';
                        next++;
                    }
                }
            }

            // stop making rows if it's the end of month
            if (day > month_length) {
                html += '</tr>';
                break;
            } else {
                html += '</tr><tr class="week">';
            }
        }
        html += '</tbody>';
        html += '</table>';

        return html;
    }

    // document.getElementById('calendar').innerHTML = Calendar(12, 2015);
    document.getElementById('calendar').innerHTML = Calendar();


    $(".week .day:not(.other-month)").click(function(){
        $(".week .day").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".select-room .room-class .button").click(function(){
        $(".select-room .room-class .button").removeClass("is-active");
        $(this).addClass("is-active");
        var target = $(this).data("select");
        $(".room-card").fadeOut();
        $(".room-card." + target).delay(300).fadeIn();
    });

    $(".select-room .room-class .button").each(function(){
        if ($(this).hasClass("is-active")){
            var target = $(this).data("select");
            $(".room-card").fadeOut();
            $(".room-card." + target).delay(300).fadeIn();
        }
    });



    $('select').each(function(){
        var $this = $(this), numberOfOptions = $(this).children('option').length;

        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
        }

        var $listItems = $list.children('li');

        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function(){
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
            $list.hide();
            //console.log($this.val());
        });

        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    });



    //Get offers
    // SCLAD

    var CODE = 'CHR',
        favoriteOne = '45548',
        favoriteTwo = '45432';



    //$.ajaxSetup({xhrFields: { withCredentials: true  } });
    $.ajax({
        type: "GET",
        url: 'http://office-arendator.ru/freerooms/freerooms.xml',
        dataType: "xml",
        success: function (data) {
            $cherry_data =  $(data).find('object[code="' + CODE + '"]').find('room')


            $cherry_data.each(function(index, element){
                var room = $(element)

                var square = room.find('square').text(),
                    type_name = room.find('type_name').text(),
                    type_code = room.find('type_code').text().toLowerCase(),
                    description = room.find('description').text(),
                    price = room.find('price').text(),
                    img = room.find('photo').text(),
                    id = room.find('id').text();


                $cut = 350
                $isAppend = true

                if (id == favoriteOne ){
                    $('.js-favorite-one').find('.about').text(description)
                    $('.js-favorite-one').find('img').attr('src',img)
                    $('.js-favorite-one').find('.title').text(type_name)

                    $isAppend = false
                }

                if (id == favoriteTwo){
                    $('.js-favorite-two').find('.about').text(description)
                    $('.js-favorite-two').find('img').attr('src',img)
                    $('.js-favorite-two').find('.title').text(type_name)

                    $isAppend = false
                }

                if ($isAppend){
                    if (description.length > $cut){
                        description = description.substr(0, $cut) + '...'
                    }

                    $(".cards").append('<div class="card" data-id="' + id  + '"><div class="card-img"><img src=' + img + '></div>' + '<div class="card-info"><p class="square">' + type_name + " помещение " + square + "м<sup>2</sup>" + '</p>'+ '<p class="description" >' + description  + '</p>'+ '<p class="price">' + price + ' руб/м' + '</p>' + '<p class="send-mail"><button class="button is-circle is-white">оставить заявку</button></p></div></div>');
                }

                //console.log(price)
            })



            //Get image in sidebar

            $.fn.random = function() {
                  return this.eq(Math.floor(Math.random() * this.length));

            }

            console.log($('.cards').find('.card').random().data('id'))

            $sideImages = $('.small-rental')
            $usedImages = [];
            $usedImages.push(favoriteOne);
            $usedImages.push(favoriteTwo);

            $sideImages.each(function(){
               $isSelected = false
                while (!$isSelected){
                    $randomCard = $('.cards').find('.card').random().data('id');
                    if ($usedImages.indexOf($randomCard) <  0){

                        $usedImages.push($randomCard);
                        $src = $('.cards').find('[data-id="' + $randomCard + '"]').find('img').attr('src');
                        console.log($src);
                        $(this).find('img').attr('src', $src);
                        $isSelected = true;

                    }
                }
            })


        }

    });



    $getMoreCardButton = $("#get-more-cards");
    $cutCardsStart = 0;
    $cutCardsEnd = 4;

    $getMoreCardButton.click(function(){
        $(this).blur();
        $('.cards').find('.card').slice($cutCardsStart, $cutCardsEnd).fadeIn().addClass('visible');
        $cutCardsStart = $cutCardsEnd;
        $cutCardsEnd += 4;
        if ($cutCardsStart > $('.cards').find('.card').length ){
            $getMoreCardButton.fadeOut();
        }
    })



});
