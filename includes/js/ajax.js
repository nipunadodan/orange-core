/*
 * The response should be in following format in order to work this fine
 * $return = array(
        'message' => 'Some message here',
        'status' => 'success', //status depending on the result
        'response_id' => $ref //additional information
    );

    echo json_encode($return);
 */

function ajaxDirect(process, serialized, silent='No',  callback=process, method='post'){
    process = process + '-process';
    if(debug === true)
        console.log('ajax-direct~'+process);
    if(silent === 'No'){
        var spinner = ' <i class="la la-circle-o-notch la-spin" id="spinner"></i>';
        $('.loading').html(spinner);
        $('input, select, button, input[type="submit"]').attr('disabled','true');
    }

    $.ajax({
        data: serialized,
        type: method,
        url: site_url + 'ajax.php?process=' + process,
        success: function (response) {
            if(debug === true)
                console.log(response);
            var json = JSON.parse(response);
            if(debug === true)
                console.log(json);

            after_functions[callback](json);

            if(silent === 'No'){
                $('input, select, button, input[type="submit"]').prop("disabled", false);
                $('#spinner').remove();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(debug === true){
                console.log('AJAX call failed.');
                console.log(textStatus + ': ' + errorThrown);
            }
        },
        complete: function () {
            if(debug === true)
                console.log('AJAX call completed');
        }
    });

    return false;
}
