$(document).ready(function() {

    $('#signupForm').validate({
            rules: {
                    name: 'required',
                    email: {
                            required: true,
                            email: true,
                            remote: '/account/validate-email'
                    },
                    password: {
                            required: true,
                            minlength: 6,
                            validPassword: true
                    }
            },
            messages: {
                    name: {
                            required: 'Musisz podać imię'
                    },
                    email: {
                            remote: 'Podany email jest zajęty',
                            required: 'Musisz podać email',
                            email: 'Podaj popraawny email'
                    },
                    password: {
                            minlength: 'Hasło musi mieć minimum 6 znaków',
                            required: 'Musisz podać hasło'
                    }
            }
    });
});