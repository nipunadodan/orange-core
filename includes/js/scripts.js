var icons = {
    'success' : 'fas fa-check-circle',
    'danger' : 'fas fa-times-circle',
    'info' : 'fas fa-info-circle',
    'warning' : 'fas fa-exclamation-triangle'
};

var dyn_functions = [];

dyn_functions['o1'] = function (json, thisForm) {
    console.log(json);
    var reset = thisForm.data('reset');
    var redirectUrl = thisForm.data('redirect');
    var popup = thisForm.data('popup');
    var scroll = thisForm.data('scroll');
    var alert = thisForm.data('alert');
    var successModal = thisForm.data('successModal');

    if(json.status === 'success'){
        if(reset == 'yes'){
            $(thisForm)[0].reset();
            if (typeof res.response_id !== 'undefined' && typeof redirectUrl !== 'undefined' ) {
                //console.log(res.response_id);
                redirectUrl += '&id='+json.response_id;
            }
        }

        if (typeof redirectUrl !== 'undefined') {
            //setTimeout(window.location = redirectUrl, 10000);
            setTimeout(function (e) {
                window.location.href = site_url+redirectUrl;
            }, 1000)
        }
    }
    $(thisForm).find('input[type="submit"]').prop('disabled', false);

    if(popup !== 'yes') {
        if(alert === 'yes') {
            $(thisForm).find('.message').show(1000).html('<span class="alert alert-' + json.status + ' d-block">' + json.message + '</span>');
        }else{
            $(thisForm).find('.message').show(1000).html('<span class="d-block">' + json.message + '</span>');
        }
        if(scroll === 'yes'){
            $('html, body').animate({
                scrollTop: $(thisForm).closest('div').find('.message').offset().top - 68
            }, 800);
        }
    }else{
        console.log('success-modal');
        if(json.status === 'success' && successModal !== 'yes'){
            if(alert === 'yes') {
                $(thisForm).find('.message').show(1000).html('<span class="alert alert-' + json.status + ' d-block">' + json.message + '</span>');
            }else{
                $(thisForm).find('.message').show(1000).html('<span class="d-block">' + json.message + '</span>');
            }
            if(scroll === 'yes'){
                $('html, body').animate({
                    scrollTop: $(thisForm).closest('div').find('.message').offset().top - 68
                }, 800);
            }
        }else{
            $(thisForm).closest('div').find('.message').html('');
            $('#success-modal .modal-content').attr('class','modal-content border-0 bg-'+json.status);
            $('#success-modal .modal-body').html(json.message);
            $('#success-modal #success-modal-title').html(json.status);
            $('#success-modal #success-modal-icon').attr('class', icons[json.status]);
            $('#success-modal').modal('toggle');
        }
    }
};
