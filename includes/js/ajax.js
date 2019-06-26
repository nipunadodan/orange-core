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

        console.log('ajax-init');

        var thisForm = $(this);
        var process = $(this).attr('name')+'-process';
        var func = $(this).data('func');
        $(thisForm).find('.message').html('<img src="'+site_url+'resources/img/waiting.gif" class="mx-auto d-block" width="80">');
        //$(thisForm).find('input[type="submit"]').prop('disabled', true);

        $.ajax({
            data: thisForm.serialize(),
            type: thisForm.attr('method'),
            url: core_url+'ajax.php?process='+process,
            success: function(response) {
                $(thisForm).find('.message').html('');

                console.log(response);
                var json = JSON.parse(response);
                //console.log(json);
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
