//Deadline
$(function() {
  var day = 1000 * 60 * 60 * 24; //One day in ms
  var today = new Date();
  var deadline = new Date(2013, 5, 3, 23, 59, 59);
  var daysLeft = Math.floor((deadline - today)/day);
  var daysLeftText = daysLeft;
  if (daysLeft > 1) {
    daysLeftText = daysLeft + ' days left';
  } else if (daysLeft === 1) {
    daysLeftText = daysLeft + ' day left';
  } else if (daysLeft === 0) {
    daysLeftText = 'This is it!';
  } else {
    daysLeftText = 'Day Passed!';
  }
  $('.deadline').text(daysLeftText);
});

//Todo List
var TodoList = {
  initLoad: function() {
    if (localStorage.getItem('saved_todo')) {
      var todo_list = localStorage.getItem('saved_todo');
      $('.todos_list').html(todo_list);
    }

    if (localStorage.getItem('done_todo')) {
      var done_list = localStorage.getItem('done_todo');
      $('.done_list').html(done_list);
    }
  },
  addNewTodo: function() {
    var todo_text = $('.todo_text').val();
    if (todo_text.length > 0) {
      $('.todos_list').prepend('<li>' + todo_text + '</li>');
      $('.todo_text').val('');
      TodoList.saveTodos();
    }
  },
  crossOffTodo: function(todo_done) {
    var done = $(todo_done);
    done.addClass('todo_done');
    TodoList.animateDoneTodo(done);
    TodoList.saveTodos();
  },
  removeDoneTodos: function() {
    $('.todo_done').slideUp(500,function() {
      $(this).remove();
      TodoList.saveTodos();
    });
  },
  saveTodos: function() {
    $('.todos_list').each(function() {
      localStorage.setItem('saved_todo',$(this).html());
    });

    $('.done_list').each(function() {
      localStorage.setItem('done_todo',$(this).html());
    });
  },
  animateDoneTodo: function(done) {
    var oldOffset = done.offset();
    $('.done_list').append(done);
    var newOffset = done.offset();
    var tempSlide = done.clone().appendTo('body');
    tempSlide.css('position', 'absolute').css('left', oldOffset.left).css('top', oldOffset.top);
    done.hide();
    tempSlide.animate({'top': newOffset.top, 'left': newOffset.left}, 800, function() {
      done.show();
      tempSlide.remove();
    });
  }
};

$(function() {
  TodoList.initLoad();
    $('.todos_form').on('submit', function(event) {
      event.preventDefault();
      TodoList.addNewTodo();
    });

    $('.todos_list').on('click', 'li', function(event) {
      TodoList.crossOffTodo(this);
    });

    $('.remove_done_todo').on('click', function(event) {
      event.preventDefault();
      TodoList.removeDoneTodos();
    });
});

//Weather
//This is the type of url we have to build:
//http://api.wunderground.com/api/API_KEY/conditions/q/pws:KNYNEWYO64.json  
var getWeather = function(api, station) {
  var weather = {};
  weather.apiKey = api;
  weather.station = station;
  weather.jsonUrl = 'http://api.wunderground.com/api/' + weather.apiKey + '/conditions/q/pws:' + weather.station + '.json';
  console.log(weather.jsonUrl);
  weather.expires = new Date().getTime() + (1000 * 60 * 5); // five minutes

  $.ajax({
    url: weather.jsonUrl,
    dataType: 'jsonp',
    success: function(json) {
      if (json.response.error) {
        console.log(json.response.error);
      } else {
        weather.feelsLike = json.current_observation.feelslike_f;
          weather.currentTemp = json.current_observation.temp_f;
          weather.icon = json.current_observation.icon_url.replace('i/c/k/','i/c/i/'); //changes the icon to a different set (a through k works)
          weather.windMph = json.current_observation.wind_mph;
          weather.looksLike = json.current_observation.weather;
          weather.buildHtml = '<img src=' + weather.icon + ' /><br/>' + weather.currentTemp + 'F - ' + weather.windMph + ' MPH';
          $('.weather').html(weather.buildHtml);
          localStorage.setItem('weather', JSON.stringify(weather)); //use localStorage since cookies don't work from file://
          console.log('Fresh weather');
      }
    }
  });
};

$(function() {
  var config = {};

  $('.settings').hide();

  $('.settings_link').on('click', function(event) {
    event.preventDefault();
    $('.settings').fadeToggle();
  });

  $('.config').blur(function() {
    config.api = $('.weather_api').val();
    config.station = $('.weather_station').val();
    localStorage.setItem('config', JSON.stringify(config));
    console.log('stored config: ' + config);
    getWeather(config.api, config.station); //get fresh weather when changing settings
  });

  if (localStorage.getItem('config')) {
    config = JSON.parse(localStorage.getItem('config'));
    $('.weather_api').val(config.api);
    $('.weather_station').val(config.station);
  }

  if (localStorage.getItem('weather')) {
    weather = JSON.parse(localStorage.getItem('weather'));
    var timeNow = new Date().getTime();
    if (timeNow > weather.expires) {
      console.log('Weather expired get new weather');
      getWeather(config.api, config.station);
    } else {
      $('.weather').html(weather.buildHtml);
      console.log('localStorage weather');
    }
  } else {
    getWeather(config.api, config.station);
  }
});