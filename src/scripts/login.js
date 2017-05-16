(function(){
    'use strict';

    const FORM_REG = $('#log_form');
    const BTN_REGISTER = $('.register-btn');

    let registerUser = (event) => {
        
        let clickedBtn = event.target.localName === 'button' ? event.target : $(event.target).parents('button')[0];
        const regType = $(clickedBtn).attr('reg_type');
        FORM_REG.attr('action', `signup/${regType}`);
        FORM_REG.submit();
    };

    BTN_REGISTER.click(registerUser);
})();