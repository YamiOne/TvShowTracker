(function () {
    'use strict';

    const ELEM_DAYS = $('.day');
    const BTN_SUBMIT = $('#btn_submit');
    const INPUT_TITLE = $('#input_title');
    const BLOCK_OPTIONS = $('#block-options');
    const CURRENT_PATH = window.location.pathname;
    const OPTIONS_POSITION = {
        OFFSET_TOP: 20,
        OFFSET_LEFT: 30
    };

    let requestData = {};
    let selectedDays = [];

    $.ajaxSetup({
        contentType:"application/json; charset=utf-8"
    });

    function setElemSelected(elem, class_name, modifier) {
        modifier ? elem.classList.add(class_name) : elem.classList.remove(class_name);
    }

    function resetForm() {
        INPUT_TITLE.val('');
        selectedDays = [];
        for (let i = 0; i < ELEM_DAYS.length; i++) {
            setElemSelected(ELEM_DAYS[i], 'day--selected', false);
        }
    }

    let submitData = (event)  => {
        requestData.title = INPUT_TITLE.val();
        requestData.days = selectedDays;

        $.ajax({
            method: "POST",
            url: 'new_show/add',
            data: JSON.stringify(requestData),
            contentType:"application/json; charset=utf-8"
        })
        .then((response) => {
            resetForm();
        }, (err) => {
            console.log(err);
        });
    };

    let deleteShow = (data) => {
        $.post('all_shows/delete', JSON.stringify(data))
            .then((response) => {
                location.reload();
            }, (err) => {
                alert(err);
            });
    };

    let setDay = (event) => {
        var element = event.target.localName === 'div' ? event.target : $(event.target).parents('div')[0];
        if ($(element).hasClass('day--selected')){
            setElemSelected(element, 'day--selected', false);
            selectedDays.splice(selectedDays.indexOf(element.getAttribute('day_val')), 1);
        } else {
            setElemSelected(element, 'day--selected', true);
            selectedDays.push(element.getAttribute('day_val'));
        }
    };

    let setOptionsVisibility = (visible) => {
        BLOCK_OPTIONS.css('display', visible ? 'flex' : 'none');
    };

    let setOptionsPosition = (top_position, left_position) => {
        BLOCK_OPTIONS.css({
            'top': top_position,
            'left': left_position
        });
    };

    let manageOptionsVisibility = (event) => {
        if (event.type === 'mouseout' || event.type === 'mouseleave') {
            if (event.relatedTarget.localName === 'span') return false;
            setOptionsVisibility(false);
            BLOCK_OPTIONS.attr('show_id', '');
            return false;
        }

        let blockPosition = event.target.localName === 'span' ? $(event.target).parent('.day') : $(event.target);

        setOptionsVisibility(true);
        setOptionsPosition(blockPosition.position().top - OPTIONS_POSITION.OFFSET_TOP, blockPosition.position().left + blockPosition.width() - OPTIONS_POSITION.OFFSET_LEFT);

        BLOCK_OPTIONS.attr('show_id', blockPosition.attr('show_id'));
    };

    let editShow = (event) => {
        console.log($(event.target).parents('.block-options')[0].getAttribute('show_id'));
    };

    let removeShow = (event) => {
        let showId = $(event.target).parents('.block-options')[0].getAttribute('show_id');
        deleteShow({show_id: showId});
    };

    let init = () => {
        BTN_SUBMIT.click(submitData);
        ELEM_DAYS.click(setDay);
    };

    let bindOptions = () => {
        ELEM_DAYS.hover(manageOptionsVisibility);
        BLOCK_OPTIONS.mouseleave(() => setOptionsVisibility(false));
        BLOCK_OPTIONS.find('span.edit').click(editShow);
        BLOCK_OPTIONS.find('span.remove').click(removeShow);
    };

    if (CURRENT_PATH.indexOf('new_show') > -1) init();
    if (CURRENT_PATH.indexOf('all_shows') > -1) bindOptions();
})();
