/*
 * The response should be in following format in order to work this fine
 * $return = array(
        'message' => 'Some message here',
        'status' => 'success', //status depending on the result
        'response_id' => $ref //additional information
    );

    echo json_encode($return);
 */

$(document).ready(function(){
    $('body').on('submit', 'form.ajax', function(event) {
        event.preventDefault();

        var thisForm = $(this);
        var process = $(this).attr('name')+'-process';
        var func = $(this).data('func');

        if(debug) {
            console.log('ajax-init~' + process);
        }

        $(thisForm).find('.message').html('<img src="'+site_url+'resources/img/waiting.gif" class="mx-auto d-block" width="80">');
        $(thisForm).find('input[type="submit"]').prop('disabled', true);

        var spinner = ' <i class="la la-circle-o-notch la-spin" id="spinner"></i>';
        $('.nav-title').after(spinner);

        $.ajax({
            data: thisForm.serialize(),
            type: thisForm.attr('method'),
            url: site_url+'ajax.php?process='+process,
            success: function(response) {
                let json;
                $(thisForm).find('.message').html('');
                $('#spinner').remove();
                $(thisForm).find('input[type="submit"]').prop('disabled', false);

                try {
                    json = JSON.parse(response);
                } catch (e) {
                    json = response;
                }

                if(debug === true) {
                    console.log(json);
                }

                if(json.status === 'sessionexired'){
                    location.reload();
                    return;
                }

                dyn_functions[func](json, thisForm);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log('AJAX call failed.');
                //console.log(textStatus + ': ' + errorThrown);
            },
            complete: function() {
                //console.log('AJAX call completed');
            }
        });

        return false;
    });
});
