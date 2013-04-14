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
	var weather = {};

	if (localStorage.getItem('weather')) {
		weather = JSON.parse(localStorage.getItem('weather'));
		$('.weather').html(weather.build_html);
		console.log("localStorage weather");
	} else {
		weather.base_url = "http://api.wunderground.com/api/API_KEY/conditions/q/pws:";
		weather.local_station = "KNYNEWYO64";
		weather.json_url = weather.base_url + weather.local_station + ".json";
		weather.fetched_time = new Date();
		
		$.ajax({
		url: weather.json_url,
		dataType: "jsonp",
		success: function(json) {
				weather.feels_like = json.current_observation.feelslike_f;
				weather.current_temp = json.current_observation.temp_f;
				weather.icon = json.current_observation.icon_url.replace("i/c/k/","i/c/i/"); //changes the icon to a different set (a through k works)
				weather.wind_mph = json.current_observation.wind_mph;
				weather.looks_like = json.current_observation.weather;
				weather.build_html = "<img src=" + weather.icon + " /><br/>" + weather.current_temp + "F - " + weather.wind_mph + " MPH";
				$('.weather').html(weather.build_html);
				localStorage.setItem('weather', JSON.stringify(weather));
				console.log("Fresh weather");
			}
		});
	}
});

var TodoList = {
	add_new_todo: function() {
		var todo_text = $('.todo_text').val();
		if (todo_text.length > 0) {
			$('.todos_list').append("<li>" + todo_text + "</li>");
			$('.todo_text').val("");
			TodoList.save_todos();
		}
	},
	cross_off_todo: function(todo_done) {
		$(todo_done).toggleClass('todo_done');
		TodoList.save_todos();

	},
	remove_done_todos: function() {
		$('.todo_done').slideUp(500,function() {
			$(this).remove();
			TodoList.save_todos();
		});
	},
	save_todos: function() {
		$('.todos_list').each(function() {
			localStorage.setItem("saved_todo",$(this).html());
		});
	}
};

$(function() {
	if (localStorage.getItem("saved_todo")) {
		var todo_list = localStorage.getItem("saved_todo");
		$('.todos_list').html(todo_list);
	}

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