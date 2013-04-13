$(function() {
	var day = 1000 * 60 * 60 * 24; //One day in ms
	var today = new Date();
	var deadline = new Date(2013, 4, 2, 23, 59, 59);
	var days_left = Math.floor((deadline - today)/day);
	if (days_left > 1) {
		$('.deadline').text(days_left + " days left");
	} else if (days_left === 1) {
		$('.deadline').text(days_left + " day left");
	} else if (days_left === 0) {
		$('.deadline').text("This is it!");
	} else {
		$('.deadline').text("Enter new date");
	}
});

$(function() {
	//http://api.wunderground.com/api/API_KEY/conditions/q/pws:KNYNEWYO64.json
	var weather = "http://api.wunderground.com/api/API_KEY/conditions/q/pws:";
	var local_station = "KNYNEWYO64";
	var weather_json = weather + local_station + ".json";
	$.ajax({
		url: weather_json,
		dataType: "jsonp",
		success: function(json) {
			var feels_like = json.current_observation.feelslike_f;
			var current_temp = json.current_observation.temp_f;
			var weather_icon = json.current_observation.icon_url.replace("i/c/k/","i/c/i/"); //changes the icon to a different set (a through k works)
			var wind_mph = json.current_observation.wind_mph;
			var looks_like = json.current_observation.weather;
			var build_html = "<img src=" + weather_icon + " /><br/>" + current_temp + "F - " + wind_mph + " MPH";
			$('.weather').html(build_html);
		}
	});
});

var TodoList = {
	add_new_todo: function() {
		var todo_text = $('.todo_text').val();
		if (todo_text.length > 0) {
			$('.todos_list').append("<li>" + todo_text + "</li>");
			TodoList.update_todo_total();
			$('.todo_text').val("");
		}
	},
	cross_off_todo: function(todo_done) {
		$(todo_done).toggleClass('todo_done');
		TodoList.update_todo_total();
	},
	update_todo_total: function() {
		var todo_total = $('.todos_list').children().not('.todo_done').size();
		$('#todo_total').text(todo_total + " Left - ");
	},
	remove_done_todos: function() {
		$('.todo_done').remove();
	}
};

$(function() {
	$('#todos_form').on('submit', function(event) {
		event.preventDefault();
		TodoList.add_new_todo();
	});

	$('.todos_list').on('click', 'li', function(event) {
		TodoList.cross_off_todo(this);
	});

	$('#remove_done_todo').on('click', function(event) {
		event.preventDefault();
		TodoList.remove_done_todos();
	});

});