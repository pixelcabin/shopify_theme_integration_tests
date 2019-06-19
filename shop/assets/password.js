window.Modals = (function() {
  function Modal(id, name, options) {
    var defaults = {
      close: '.js-modal-close',
      open: '.js-modal-open-' + name,
      openClass: 'modal--is-active'
    };

    this.$modal = $('#' + id);

    if (!this.$modal.length) {
      return false;
    }

    this.nodes = {
      $parent: $('html').add('body')
    };
    this.config = $.extend(defaults, options);
    this.modalIsOpen = false;
    // eslint-disable-next-line shopify/jquery-dollar-sign-reference
    this.$focusOnOpen = this.config.focusOnOpen
      ? $(this.config.focusOnOpen)
      : this.$modal;
    this.init();
  }

  Modal.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$modal.find(this.config.close).on('click', $.proxy(this.close, this));
  };

  Modal.prototype.open = function(evt) {
    // Keep track if modal was opened from a click, or called by another function
    var externalCall = false;

    // don't open an opened modal
    if (this.modalIsOpen) {
      return;
    }

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the modal opens, the click event bubbles up to $nodes.page
    // which closes the modal.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.modalIsOpen && !externalCall) {
      this.close();
    }

    this.$modal.addClass(this.config.openClass);
    this.nodes.$parent.addClass(this.config.openClass);

    this.modalIsOpen = true;

    // Set focus on modal
    slate.a11y.trapFocus({
      $container: this.$modal,
      $elementToFocus: this.$focusOnOpen,
      namespace: 'modal_focus'
    });

    this.bindEvents();
  };

  Modal.prototype.close = function() {
    // don't close a closed modal
    if (!this.modalIsOpen) {
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    this.$modal.removeClass(this.config.openClass);
    this.nodes.$parent.removeClass(this.config.openClass);

    this.modalIsOpen = false;

    // Remove focus on modal
    slate.a11y.removeTrapFocus({
      $container: this.$modal,
      namespace: 'modal_focus'
    });

    this.unbindEvents();
  };

  Modal.prototype.bindEvents = function() {
    // Pressing escape closes modal
    this.nodes.$parent.on(
      'keyup.modal',
      $.proxy(function(evt) {
        if (evt.keyCode === 27) {
          this.close();
        }
      }, this)
    );
  };

  Modal.prototype.unbindEvents = function() {
    this.nodes.$parent.off('.modal');
  };

  return Modal;
})();


$(function() {
  var selectors = {
    loginModal: '#LoginModal',
    loginField: '[data-login-field]'
  };

  var data = {
    formError: 'data-error'
  };

  var loginModal = document.querySelector(selectors.loginModal);
  var loginField = document.querySelector(selectors.loginField);

  if (!loginModal) {
    return;
  }

  var passwordModal = new window.Modals('LoginModal', 'login-modal', {
    focusOnOpen: '#Password'
  });

  // Open modal if errors exist
  if (loginField.hasAttribute(data.formError)) {
    passwordModal.open();
  }
});
