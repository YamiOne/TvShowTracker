(function () {
    'use strict';

    const ELEM_DAYS = $('.day');
    const EDIT_DAY = $('#edit_day');
    const BTN_SUBMIT = $('#btn_submit');
    const EDIT_TITLE = $('#edit_title');
    const INPUT_TITLE = $('#input_title');
    const CLOSE_MODAL = $('.close-modal');
    const YES_MODAL = $('#yes_modal_btn');
    const EDIT_MODAL = $('#edit_modal_btn');
    const BLOCK_OPTIONS = $('#block-options');
    const PROGRESS_OVERLAY = $('#progress_overlay');
    const CURRENT_PATH = window.location.pathname;
    const OPTIONS_POSITION = {
        OFFSET_TOP: 20,
        OFFSET_LEFT: 65
    };

    let showId = null;
    let showToEdit = {};
    let requestData = {};
    let selectedDays = [];

    $.ajaxSetup({
        contentType:"application/json; charset=utf-8"
    });

    function setElemSelected(elem, class_name, modifier) {
        modifier ? elem.classList.add(class_name) : elem.classList.remove(class_name);
    }
    
    function animateModal(modalOverlay, visible){
        if (visible) {
            modalOverlay.css('display', 'flex');
            setTimeout(() => {
                modalOverlay.find('.modal').css('transform', 'scale(1)');
            }, 300);
        } else {
            modalOverlay.find('.modal').css('transform', 'scale(0)');
            setTimeout(() => {
                modalOverlay.css('display', 'none');
            }, 300);
        }
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
        PROGRESS_OVERLAY.css('display', 'flex');

        $.ajax({
            method: "POST",
            url: 'new_show/add',
            data: JSON.stringify(requestData),
            contentType:"application/json; charset=utf-8"
        })
        .then((response) => {
            PROGRESS_OVERLAY.css('display', 'none');
            animateModal($('#msg_overlay'), true);
            setTimeout(() => {
                animateModal($('#msg_overlay'), false);
            }, 2000);
            resetForm();
        }, (err) => {
            console.log(err);
        });
    };

    let deleteShow = () => {
        $.post('all_shows/delete', JSON.stringify({ show_id: showId }))
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
        if (!visible) $('.day--focused').removeClass('day--focused');
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
            $(event.target).removeClass('day--focused');
            setOptionsVisibility(false);
            BLOCK_OPTIONS.attr('show_id', '');
            return false;
        }

        let blockPosition = event.target.localName === 'span' ? $(event.target).parent('.day') : $(event.target);

        blockPosition.addClass('day--focused');
        setOptionsVisibility(true);
        setOptionsPosition(blockPosition.position().top - OPTIONS_POSITION.OFFSET_TOP, blockPosition.position().left + blockPosition.width() - OPTIONS_POSITION.OFFSET_LEFT);

        BLOCK_OPTIONS.attr('show_id', blockPosition.attr('show_id'));
        BLOCK_OPTIONS.attr('show_title', blockPosition.text());
        BLOCK_OPTIONS.attr('current_day', $(blockPosition.parents('.day-wrapper')[0]).find('span.title').attr('day_index'));
    };

    let editShow = (event) => {
        animateModal($('#edit_overlay'), true);
        showToEdit = {
            show_id: $(event.target).parents('.block-options')[0].getAttribute('show_id'),
            show_title: $(event.target).parents('.block-options')[0].getAttribute('show_title'),
            current_day: $(event.target).parents('.block-options')[0].getAttribute('current_day')
        };

        EDIT_TITLE.val(showToEdit.show_title);
        EDIT_DAY.val(showToEdit.current_day);
    };

    let editShowReq = () => {
        showToEdit.show_day = EDIT_DAY.val();
        showToEdit.show_title = EDIT_TITLE.val();

        $.ajax({
            method: "POST",
            url: 'all_shows/edit',
            data: JSON.stringify(showToEdit),
            contentType:"application/json; charset=utf-8"
        })
        .then((response) => {
            location.reload();
        }, (err) => {
            console.log(err);
        });
    };

    let removeShow = (event) => {
        animateModal($('#msg_overlay'), true);
        showId = $(event.target).parents('.block-options')[0].getAttribute('show_id');
    };

    /**
     * Binding listeners used in 'New show' tab
     */
    let init = () => {
        BTN_SUBMIT.click(submitData);
        ELEM_DAYS.click(setDay);
    };

    /**
     * Binding listeners used in 'All shows' tab
     */
    let bindOptions = () => {
        YES_MODAL.click(deleteShow);
        EDIT_MODAL.click(editShowReq);
        ELEM_DAYS.hover(manageOptionsVisibility);
        BLOCK_OPTIONS.find('span.edit').click(editShow);
        BLOCK_OPTIONS.find('span.remove').click(removeShow);
        BLOCK_OPTIONS.mouseleave(() => setOptionsVisibility(false));
        CLOSE_MODAL.click((event) => {
            let modal = $(event.target).parents('.overlay')[0];
            animateModal($(modal), false);
        });
    };

    if (CURRENT_PATH.indexOf('new_show') > -1) init();
    if (CURRENT_PATH.indexOf('all_shows') > -1) bindOptions();
})();
