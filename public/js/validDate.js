$.validator.addMethod('validDate',
    function(value, element, param) {
        
        if (value != '') {
          if (value.match(/^\d{4}-\d{2}-\d{2}$/i) == null) { // format YYYY-MM-DD
              return false;
          }
          return true;
    }
    'Podaj poprawną datę w formacie rrrr-mm-dd'
    });