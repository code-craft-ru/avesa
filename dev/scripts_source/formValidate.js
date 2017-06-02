require('jquery');
require('jquery-validation');
;jQuery.extend(jQuery.validator.messages, {
    required: "Введите данные.",
    remote: "Пожалуйста, введите правильное значение.",
    email: "Вы ввели неправильный email.",
    tel: "Вы ввели неправильный номер.",
    teloremail: "Введите , корректный телефон или email адресс.",
    url: "Пожалуйста, введите корректный URL.",
    date: "Пожалуйста, введите корректную дату.",
    dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
    number: "Пожалуйста, введите число.",
    digits: "Пожалуйста, вводите только цифры.",
    creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
    equalTo: "Пожалуйста, введите такое же значение ещё раз.",
    extension: "Пожалуйста, выберите файл с правильным расширением.",
    maxlength: $.validator.format("Пожалуйста, введите не больше {0} символов."),
    minlength: $.validator.format("Пожалуйста, введите не меньше {0} символов."),
    rangelength: $.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),
    range: $.validator.format("Пожалуйста, введите число от {0} до {1}."),
    max: $.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),
    min: $.validator.format("Пожалуйста, введите число, большее или равное {0}.")
});

(function ($) {

    $.validator.addMethod("require_from_group", function (value, element, options) {
        var numberRequired = options[0];
        var selector = options[1];
        var fields = $(selector, element.form);

        var filled_fields = fields.filter(function () {
            // it's more clear to compare with empty string
            return $(this).val() != "";
        });
        var empty_fields = fields.not(filled_fields);

        if(options[2]){
            _GLOB.require_from_group_msg = options[2];
        }

        // we will mark only first empty field as invalid
        if (filled_fields.length < numberRequired && empty_fields[0] == element) {

            //console.log('req gr = FALSE')
            return false;
        }

        return true;
        // {0} below is the 0th item in the options field
    }, function(){
        return $.validator.format(_GLOB.require_from_group_msg);
    });


})(jQuery);

// Email
jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*[.][a-zA-Z0-9-]{1,8}$/.test(value);
    },
    "Вы ввели неправильный email.");

// Telephone
jQuery.validator.addMethod("tel", function (value, element) {
        //return this.optional(element) || /^((8|\+7|\+8)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value);
        return this.optional(element) || /^([\+])?[\d\- ]{7,20}$/.test(value);
    },
    "Вы ввели неправильный номер.");

jQuery.validator.addMethod('teloremail' , function(value , element){
    // is tel number
    if (this.optional(element) || /^([\+])?[\d\- ]{7,20}$/.test(value)) {
        var name = $(element).attr('data-name-field');
        $(element).attr('name' , name+'[tel]'  );
        console.log(value , element)
        return true;
    }


    // is email
    if(this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*[.][a-zA-Z0-9-]{1,8}$/.test(value)){
        var name = $(element).attr('data-name-field');
        $(element).attr('name' , name+'[email]'  );
        return true;
    }

});  

// Validation for class
jQuery.validator.addClassRules('js_field_digits', {
    digits: true
});


// 
// @event  form.send.{idform} return inputs
// @event  form.sendsuccess.{idform} return inputs
// 

(function ($) {
    $.fn.validationManager = function () {
        $(this).each(function () {
            var $form = $(this),
                $inputs = $form.find('input'),
                $formAllMsg = $form.find('.js-form__all-msg'),
                $groupInps = $form.find('[data-valid-group]'),
                formAction = $form.attr('action'),
                dataValidCase = $form.data('validation-case'),
                options,
                rules = {},
                submitAble = true,
                typeForm = $form.attr('data-form-id');

            // One of group
            $.each($groupInps, function () {
                var $this = $(this),
                    groupName = $this.data('valid-group'),
                    name = $this.attr('name');

                rules[name] = {
                    require_from_group: [1, '[data-valid-group="' + groupName + '"]', 'Пожалуйста, укажите свой e-mail или телефон.']
                };
            });


            options = {
                errorClass: "error",
                validClass: "success",
                focusCleanup: false,
                focusInvalid: false,
                highlight: function(element, errorClass, validClass){
                    $(element).parent().addClass(errorClass).removeClass(validClass);
                },
                unhighlight: function(element, errorClass, validClass){
                    $(element).parent().removeClass(errorClass).addClass(validClass);
                },
                errorPlacement: function(){

                },
                errorElement: 'span',
                ignore: '.ignore, :hidden, ._disabled', // _disabled - класс для временного дизейбла, не использовать в изначальной разметке
                rules: rules,
                submitHandler: function (e) {

                    console.log('submit handle');
                    if(!submitAble){
                        $formAllMsg.html("Подождите, идёт обработка.");
                        return false;
                    }
                    console.log(typeForm)
                    if(typeForm){
                        $('body').trigger('form.send.'+typeForm , {inputs:$inputs});
                    }

                    // выключаем форму
                    submitAble = false;
                    $form.addClass('_disabled');
                    $inputs.addClass('_disabled');

                    $.ajax({
                        type: 'POST',
                        url: formAction,
                        data: $form.serialize(),
                        dataType: 'json',
                        success: function (data) {
                            var parsedData = data,
                            
                                dataError = parsedData.error,
                                dataMsg = parsedData.message;

                            if(!dataError && typeForm){
                                $('body').trigger('form.sendsuccess.'+typeForm , {inputs:$inputs});
                            }

                            if (dataMsg) {
                                $formAllMsg.html(dataMsg);
                            } else {
                                $formAllMsg.html('');
                            }

                            if (dataError) {
                                $formAllMsg.addClass('_error');
                            } else {
                                $formAllMsg.removeClass('_error');
                                $form[0].reset();
                            }
                        }
                    }).done( function () {
                        submitAble = true;
                        $form.removeClass('_disabled');
                        $inputs.removeClass('_disabled');

                    })
                }
            };


            $form.validate(options);

        });
    }



})(jQuery);



$(function () {
    var $form = $('.js-form');
    if (!$form.length) return;

    $form.validationManager();
});




