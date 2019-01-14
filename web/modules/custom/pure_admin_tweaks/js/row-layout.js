(function ($, Drupal) {
  'use strict';

  /**
   * Logic for this behavior is borrowed from W3C's recommended logic for
   * accessible accordions.
   *
   * This content is licensed according to the W3C Software License at
   * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
   */
  Drupal.behaviors.rowLayout = {
    attach: function (context, settings) {
      Array.prototype.slice.call(document.querySelectorAll('.js-oomph-accordion')).forEach(function (accordion) {
        // Allow for multiple accordion sections to be expanded at the same time
        var allowMultiple = accordion.hasAttribute('data-allow-multiple');
        // Allow for each toggle to both open and close individually
        var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

        // Create the array of toggle elements for the accordion group
        var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.oomph-accordion__trigger'));
        var panels = Array.prototype.slice.call(accordion.querySelectorAll('.oomph-accordion__details'));

        accordion.addEventListener('click', function (event) {
          var target = event.target;

          if (target.classList.contains('oomph-accordion__trigger')) {
            // Check if the current toggle is expanded.
            var isExpanded = target.getAttribute('aria-expanded') == 'true';
            var active = accordion.querySelector('[aria-expanded="true"]');

            // without allowMultiple, close the open accordion
            if (!allowMultiple && active && active !== target) {
              // Set the expanded state on the triggering element
              active.setAttribute('aria-expanded', 'false');
              // Hide the accordion sections, using aria-controls to specify the desired section
              document.getElementById(active.getAttribute('aria-controls')).setAttribute('aria-hidden', '');

              // When toggling is not allowed, clean up disabled state
              if (!allowToggle) {
                active.removeAttribute('aria-disabled');
              }
            }

            if (!isExpanded) {
              // Set the expanded state on the triggering element
              target.setAttribute('aria-expanded', 'true');
              // Hide the accordion sections, using aria-controls to specify the desired section
              document.getElementById(target.getAttribute('aria-controls')).removeAttribute('aria-hidden');

              // If toggling is not allowed, set disabled state on trigger
              if (!allowToggle) {
                target.setAttribute('aria-disabled', 'true');
              }
            }
            else if (allowToggle && isExpanded) {
              // Set the expanded state on the triggering element
              target.setAttribute('aria-expanded', 'false');
              // Hide the accordion sections, using aria-controls to specify the desired section
              document.getElementById(target.getAttribute('aria-controls')).setAttribute('aria-hidden', '');
            }

            event.preventDefault();
          }
        });


      })

      //field--name-field-layout

      $('.field--name-field-layout select', context).each(function() {
        Drupal.behaviors.rowLayout.set_class_and_attribute($(this).closest('.paragraphs-subform'), 'row-layout--', $(this)[0].value);
        $(this).change(function(e) {
          Drupal.behaviors.rowLayout.set_class_and_attribute($(e.currentTarget).closest('.paragraphs-subform'), 'row-layout--', e.currentTarget.value);
        });
      });

    },
    set_class_and_attribute: function($element, label, value) {
      var previous_value = $element.attr('data-'+ label);
      if (previous_value) $element.removeClass(label + previous_value);
      $element.attr('data-'+ label, value);
      $element.addClass(label + value);
    },
  };
})(jQuery, Drupal);
