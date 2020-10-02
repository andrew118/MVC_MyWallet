var today = new Date();

function checkWeekday() {
	var daysNames = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
	
	return daysNames[today.getDay()];
}

function dayComment() {
	var day = checkWeekday();
	
	if (day === "sobota" || day === "niedziela") {
		day += ". Może imprezka? Albo wypadzik na miasto? &#9787;"
	} else {
		day += ". Praca, praca, praca... &#9822;"
	}
	
	$('#dayOfWeek').html(day);
	}