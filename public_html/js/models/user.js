define(function(require) {

	var Backbone = require('backbone'),
		hasFalseVal = require('objectHasFalseValue');

	var UserModel = Backbone.Model.extend({
		defaults: {
			login: '',
			password: '',
			email: ''
		},
		url: '/api/user/',
		validate: function (formData) {
			console.log(formData);
			var error = {};
			$.each(formData, function(key, val) {
				if (!val) {
					error[key] = false;
				} else {
					error[key] = true;
				}
			});

			if (hasFalseVal(error)) {
				return error;
			}
		}
	});

	return new UserModel();
});