(function($) {
    $.fn.surveySelect = function(options) {

        if (typeof options === 'string') {
            if (options === 'destroy') {
                this.each(function() {
                    var $el = $(this),
                        $dropDown = $el.next('.surveys');

                    if ($dropDown.length !== 0) {
                        $dropDown.remove();
                        $el.show();
                    }
                });
                if ($('.surveys').length === 0) {
                    $(document).off('.surveys');
                }
            } else {
                console.log('options "' + options + '" does not support.')
            }
            return this;
        }
        var N = options || 10;

        // Create custom select
        this.each(function() {
            var $el = $(this);

            if ($el.prop('tagName') === 'SELECT' && !$el.next().hasClass('surveys')) {
                createSurveySelect($el);
            }
        });

        function createSurveySelect($el) {
            $el.hide(); // Hide native select

            var $dropDown = $('<div></div>').
                                addClass('surveys').
                                addClass($el.attr('disabled') ? 'disabled' : '').
                                attr('tabindex', $el.attr('disabled') ? null : '0').
                                html('<span class="current"></span><table class="list"><tbody></tbody></table>').
                                insertAfter($el),
                $tbody = $dropDown.find('tbody'),
                $options = $el.find('option');

            $dropDown.find('.current').html($options.filter(':selected').text());

            $.each(transpose(divide($options.filter("[value!='']").get(), N)), function() {
                var tr = $('<tr></tr>');
                $.each(this, function(_, option) {
                    if (option) {
                        var $option = $(option);
                        tr.append(
                            $('<td></td>')
                                .attr('data-value', $option.val())
                                .addClass('option' +
                                    ($option.is(':selected') ? ' selected' : '') +
                                    ($option.is(':disabled') ? ' disabled' : ''))
                                .html($option.text())
                        )
                    }
                });
                $tbody.append(tr);
            });
        }

        function divide(array, n){
            var idx = 0,
                newArray = [],
                len = array.length;

            while (idx + n < len) {
                newArray.push(array.slice(idx, idx + n));
                idx += n;
            }

            newArray.push(array.slice(idx, len + 1));
            return newArray;
        }
        
        function transpose(array) {
            var rowLen = array.length,
                colLen = array[0].length,
                newArray = new Array(colLen);

            for (var i = 0; i < colLen; ++i) {
                newArray[i] = [];
                for (var j = 0; j < rowLen; j++) {
                    newArray[i][j] = array[j][i];
                }
            }

            return newArray;
        }

        // Reset Event
        $(document).off('.surveys');

        // Open and Close
        $(document).on('click.surveys', '.surveys', function(e) {
            var $dropDown = $(this);

            $('.surveys').not($dropDown).removeClass('open');
            $dropDown.toggleClass('open');

            if ($dropDown.hasClass('open')) {
                $dropDown.find('.focus').removeClass('focus').end().
                          find('.selected').addClass('focus');
            } else {
                $dropDown.focus();
            }
        });

        // Click outside
        $(document).on('click.surveys', function(e) {
            if ($(e.target).closest('.surveys').length === 0) {
                $('.surveys').removeClass('open');
            }
        });

        // Click option
        $(document).on('click.surveys', '.surveys .option:not(.disabled)', function(e) {
            var $option = $(this),
                $dropDown = $option.closest('.surveys');

            $dropDown.find('.selected').removeClass('selected');
            $option.addClass('selected');

            $dropDown.find('.current').text($option.text()).end().
                      prev('select').val($option.attr('data-value')).trigger('change');
        });

        return this;
    };
}(jQuery));
