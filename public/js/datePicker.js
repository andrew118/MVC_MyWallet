// begin date picker
var config_begin = {
			target: 'begin_date',
			timepicker: false,
      datepicker: ['dates', 'months', 'years'],

		};

var beginDatepicker = new MtrDatepicker(config_begin);
var beginOutput = beginDatepicker.format('Y-MM-DD');

document.getElementById('hiden_begin_date').value = beginOutput;

beginDatepicker.onChange('date', function() {

  beginOutput = beginDatepicker.format('Y-MM-DD');
  document.getElementById('hiden_begin_date').value = beginOutput;
  
});

// end date picker
var config_end = {
			target: 'end_date',
			timepicker: false,
      datepicker: ['dates', 'months', 'years']
		};

var endDatepicker = new MtrDatepicker(config_end);
var endOutput = endDatepicker.format('Y-MM-DD');

document.getElementById('hiden_end_date').value = endOutput;

endDatepicker.onChange('date', function() {

  endOutput = endDatepicker.format('Y-MM-DD');
  document.getElementById('hiden_end_date').value = endOutput;
  
});