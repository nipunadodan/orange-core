$(document).ready(function(){
    /*
     * response should be in following format in order to work this fine
     * $return = array(
            'message' => 'Some message here',
            'status' => 'success', //status depending on the result
            'response_id' => $ref //additional information
        );

        echo json_encode($return);
     */
    $('body').on('submit', 'form.o1', function(event) {
        event.preventDefault();

        var thisForm = $(this);
        var process = $(this).attr('name')+'-process';
        var redirectUrl = $(this).data('redirect');
        var reset = $(this).data('reset');
        $(thisForm).find('.message').html('<img src="'+site_url+'resources/images/waiting.gif" class="mx-auto d-block" width="80">');
        $(thisForm).find('input[type="submit"]').prop('disabled', true);

        $.ajax({
            data: thisForm.serialize(),
            type: thisForm.attr('method'),
            url: site_url+'ajax.php?process='+process,
            success: function(response) {
                //console.log('hi');
                console.log('response: '+response);
                var res = JSON.parse(response);
                if(res.status === 'success'){
                    if(reset == 'yes'){
                        $(thisForm)[0].reset();
                        if (typeof res.response_id !== 'undefined' && typeof redirectUrl !== 'undefined' ) {
                            //console.log(res.response_id);
                            redirectUrl += '&id='+res.response_id;
                        }
                    }
                }
                $(thisForm).find('.message').show(1000).html('<span class="alert alert-'+res.status+' d-block">'+res.message+'</span>');
                //$('.message span').delay(10000).fadeOut(1000, function(){ $('.message span').remove(); $('.modal').modal('hide');});

                if(res.status === 'success') {
                    if (typeof redirectUrl !== 'undefined') {
                        //setTimeout(window.location = redirectUrl, 10000);
                        setTimeout(function (e) {
                            window.location.href = redirectUrl;
                        }, 2000)
                    }
                }
                $(thisForm).find('input[type="submit"]').prop('disabled', false);
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


    $('body').on('submit', 'form.api', function (e) {
        e.preventDefault();
        var thisForm = $(this);
        var thisFormSerialized = $(this).serialize();
        var action = $(this).attr('action');
        var method = $(this).attr('method');
        var reset = $(this).data('reset');
        var popup = $(this).data('popup');
        var scroll = $(this).data('scroll');
        var validate = $(this).data('validate');
        var xfunction = $(this).data('function');
        var aftersuccess = $(this).data('aftersuccess');
        var process = $(this).attr('name')+'-process';
        var targetEleId = $(this).data('targetele');
        var booking_id = $('#booking_id').val();

        //console.log(process);

        $(thisForm).next('.message').slideDown().html('<img src="' + site_url + 'resources/images/waiting.gif" class="mx-auto d-block" width="80">');
        $(thisForm).find('input#submitBtn').prop('disabled', true);

        $.ajax({
            data: thisForm.serialize(),
            type: method,
            url: site_url + 'ajax.php?process=' + process,
            success: function (response) {
                //console.log(response);

                if (window.innerWidth > 800) {
                    $("label[data-toggle='popover']").popover({trigger: "hover"});
                }
                var booking = JSON.parse(response);

                if(popup !== 'yes') {
                    $(thisForm).closest('div').find('.message').slideDown().html('<span class="text-'+booking.status+'">'+booking.message+'</span>');
                    if(scroll === 'yes'){
                        $('html, body').animate({
                            scrollTop: $(thisForm).closest('div').find('.message').offset().top - 68
                        }, 800);
                    }
                }else{
                    $(thisForm).closest('div').find('.message').html('');
                    $('#bookingSuccessModal .modal-body').html(booking.message);
                    $('#bookingSuccessModal').modal('toggle');
                }
                if(typeof aftersuccess !== 'undefined' && aftersuccess !== '' && booking.status == 'success'){
                    console.log(booking.refID);
                    console.log('mail init');
                    $.ajax({
                        data: thisFormSerialized+ "&refID=" + booking.refID + "&fare=" + booking.fare,
                        type: 'POST',
                        url: site_url + 'ajax.php?process=' + aftersuccess+'-process',
                        success: function (res) {
                            //console.log(res);
                            emailres = JSON.parse(res);
                            if(emailres.status == 'danger'){
                                $('#bookingSuccessModal .modal-body').html('<span class="text-'+emailres.status+'">'+emailres.message+'</span>');
                                if(!($("#bookingSuccessModal").data('bs.modal') || {})._isShown){
                                    $('#bookingSuccessModal').modal('toggle');
                                }
                            }else if(emailres.status == 'success'){
                                console.log('mail sent');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            //console.log('AJAX call failed.');
                            //console.log(textStatus + ': ' + errorThrown);
                        },
                        complete: function () {
                            //console.log('AJAX call completed');
                        }
                    });
                }
                if (reset == 'yes') {
                    $(thisForm)[0].reset();
                    $('form')[0].reset();
                    $('#fares').slideUp();
                }
                datetimeinit();
                telephone();
                imgtosvg();
                $(thisForm).find('input#submitBtn').prop('disabled', false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //console.log('AJAX call failed.');
                //console.log(textStatus + ': ' + errorThrown);
            },
            complete: function () {
                //console.log('AJAX call completed');
            }
        });

        return false;
    });

    $('body').on('submit', 'form.cancelBooking', function (e) {
        e.preventDefault();
        var method = $(this).attr('method');
        var process = $(this).attr('name')+'-process';
        var thisForm = $(this);

        $(thisForm).find('.message').html('');

        if (confirm("Are you sure want to cancel the booking?")) {
            $.ajax({
                data:thisForm.serialize(),
                type:method,
                url: site_url+'ajax.php?process='+process,
                success: function (res) {
                    //console.log(res);
                    var json = JSON.parse(res);
                    if (json.success == true) {
                        console.log('Booking Cancelled');
                        $('#status').addClass('text-danger').html('Cancelled');
                        $('button#cancel-booking').remove();
                        $('#cancel-conf-modal').modal('hide');
                    } else {
                        $(thisForm).find('.message').html('Cancellation failed! Please make sure the phone number entered was used when making the booking.');
                    }
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
        }

        return false;
    });

    //file uploading ajax
    $('form.uploads').on('submit', function(event) {
        event.preventDefault();
        //var formData = new FormData($(this));
        var thisForm = $(this);
        var formDivId = $(this).attr('name')+'-form';
        $('#progbarWidth').width(0);
        var process = $(this).attr('name')+'-process';
        $('.message span').hide();
        var formData = new FormData(this);
        ////console.log($(thisForm).serialize());
        var reset = $(this).data('reset');
        $.ajax({
            data: formData,
            type: 'POST',//$(this).attr('method'),
            url: site_url+'ajax.php?process='+process,
            xhr: function () {
                myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                }
                return myXhr;
            },
            success: function(response) {
                //console.log(response);
                if(reset == 'yes') {
                    $(thisForm)[0].reset();
                }
                $( thisForm ).next('.message').next('#progress').hide('fast');
                $(thisForm).find('.message').slideDown(500,function(){
                    $(thisForm).find('.message').html(response);
                });
                $('.message span').delay(10000).slideUp(2000, function(){ $('.message span').remove(); });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log('AJAX call failed.');
                //console.log(textStatus + ': ' + errorThrown);
            },
            complete: function() {
                //console.log('AJAX call completed');
            },

            cache: false,
            contentType: false,
            processData: false
        });

        $( thisForm ).next('.message').after( "<div id='progress'><div id='progbarWidth'></div></div>" );

        function progressHandlingFunction(e) {
            if (e.lengthComputable) {
                var s = parseInt((e.loaded / e.total) * 100);
                $("#progress #progbarWidth").text(s + "%");
                $("#progbarWidth").width(s + "%");
            }
        }

        return false;
    });


    function packagesPopUp() {
        //packages
        console.log('hi machan');
    }

    /* statistics */
    $('body').on('click', 'button#cancel-submit', function (e) {
        //e.preventDefault();
        function getJSessionId(){
            var jsId = document.cookie.match(/PHPSESSID=[^;]+/);
            if(jsId != null) {
                if (jsId instanceof Array)
                    jsId = jsId[0].substring(11);
                else
                    jsId = jsId.substring(11);
            }
            return jsId;
        }

        var thisForm = $('#quick-book-panel form.api');
        var jsId = getJSessionId();
        $.ajax({
            data: thisForm.serialize()+'&session='+jsId,
            type: 'POST',
            url: site_url+'ajax.php?process=statistics-process',
            success: function(response) {
                //console.log('hi');
                console.log('response: '+response);
                var res = JSON.parse(response);
                if(res.status === 'success'){

                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log('AJAX call failed.');
                //console.log(textStatus + ': ' + errorThrown);
            },
            complete: function() {
                //console.log('AJAX call completed');
            }
        });
    });
});
