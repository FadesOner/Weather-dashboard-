$(document).ready(function () {

    var date = moment().format("YYYY-MM-DD")

    console.log(date);

    function storeCities() {
        $('.previous-cities').empty()
        var recentCities = JSON.parse(localStorage.getItem('cities')) || []
        for (var i = 0; i < recentCities.length; i++) {
            while (recentCities.length > 5) {
                var lastFive = recentCities.length - 5;
                var index = 0;
                recentCities.splice(index, lastFive);
                index++
            }
            var newCity = $('<li>')
            newCity.addClass("list-group-item bg-dark text-white");
            newCity.text(recentCities[i].name)
            $('.previous-cities').append(newCity);

            
        }
    }
    storeCities()

    $(".button").on("click", function (event) {
        event.preventDefault();

        var city = $('.form-control').val()
        var cityList = [];

        var recentCities = JSON.parse(localStorage.getItem('cities')) || []
        $('.previous-cities').val(recentCities);
        var savedCity = {
            name: city
        };
        recentCities.push(savedCity);
        localStorage.setItem('cities', JSON.stringify(recentCities));

        storeCities()
        search(city);
    })



    $('.previous-cities').on('click', "li", function (event) {
        event.preventDefault();
        var city = $(this).text()
        search(city);


    })
    function search(city) {
        
        $(".none").show()
        var queryURLOne = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=3fd6fe0ffea0635ce66bad8fbbaab06d'

//  API call to  obtain latitude and longitude 
        $.when(
            $.ajax({
                url: queryURLOne,
                method: "GET"

            }))
            .then(function (response) {
                var latitude = response.coord.lat;
                var longititude = response.coord.lon;
                var queryURLTwo = 'https://api.openweathermap.org/data/2.5/uvi?appid=3fd6fe0ffea0635ce66bad8fbbaab06d&lat=' + latitude + '&lon=' + longititude;

                // API call for UV index 
                $.ajax({
                    url: queryURLTwo,
                    method: "GET"
                })
                    .then(function (responseTwo) {

                        // code to storage current  information card; 5 day forecast information
                        $('.city-name').empty();

                        var cityName = response.name;
                        var temp = (response.main.temp - 273.15) * 9 / 5 + 32
                        var fahrenheit = $('<p>')
                        var humidity = $('<p>');
                        var windSpeed = response.wind.speed * 2.236936;
                        var imperialWindSpeed = $('<p>');
                        var indexEl = $('<span>');
                        indexEl.text("UV Index: ");
                        var indexNumber = parseFloat(responseTwo.value)
                        var indexNumberEl = $('<span>');
                        indexNumberEl.text(indexNumber);
                        indexNumberEl.attr('id', 'index-number');

                        if (indexNumber <= 2) {
                            indexNumberEl.addClass('d-inline p-2 bg-success text-white')

                        } else if (indexNumber >= 3 && indexNumber <= 7) {
                            indexNumberEl.addClass('d-inline p-2 bg-warning text-white')

                        } else {
                            indexNumberEl.addClass('d-inline p-2 bg-danger text-white')

                        }

                        var todaysWeather = response.weather[0].icon;
                        fahrenheit.text("Temperature: " + temp.toFixed(1) + "°F")
                        humidity.text("Humidity: " + response.main.humidity + '%')
                        imperialWindSpeed.text("Wind Speed: " + windSpeed.toFixed(1) + " MPH")

                        var weatherIcon = 'https://openweathermap.org/img/wn/' + todaysWeather + ".png";
                        var iconDisplay = $('<img>')
                        iconDisplay.attr('src', weatherIcon);
                        $('.city-name').append(cityName + ": " + date);
                        $('.city-name').append(iconDisplay);
                        $('.city-name').append(fahrenheit);
                        $('.city-name').append(humidity);
                        $('.city-name').append(imperialWindSpeed);
                        $('.city-name').append(indexEl);
                        $('.city-name').append(indexNumberEl);
                    })



                var queryURLThree = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=3fd6fe0ffea0635ce66bad8fbbaab06d'
                $.ajax({
                    url: queryURLThree,
                    method: "GET"
                })
                    .then(function (responseThree) {
                        $('#1').empty();
                        $('#2').empty();
                        $('#3').empty();
                        $('#4').empty();
                        $('#5').empty();
                        var dayOne = $('<h6>');
                        var dayTwo = $('<h6>');
                        var dayThree = $('<h6>');
                        var dayFour = $('<h6>');
                        var dayFive = $('<h6>');
                        dayOne.text(moment(date).add(1, 'days').format("MMM Do YY"));
                        dayTwo.text(moment(date).add(2, 'days').format("MMM Do YY"));
                        dayThree.text(moment(date).add(3, 'days').format("MMM Do YY"));
                        dayFour.text(moment(date).add(4, 'days').format("MMM Do YY"));
                        dayFive.text(moment(date).add(5, 'days').format("MMM Do YY"));
                        $('#1').append(dayOne);
                        $('#2').append(dayTwo);
                        $('#3').append(dayThree);
                        $('#4').append(dayFour);
                        $('#5').append(dayFive);

                        var j = 1
                        for (var i = 0; i < responseThree.list.length; i++) {

                            if (responseThree.list[i].dt_txt.indexOf("12:00:00") !== -1 &&
                                responseThree.list[i].dt_txt.indexOf("15:00:00") !== -1 ||
                                responseThree.list[i].dt_txt.indexOf("18:00:00") !== -1) {

                                var selector = "#" + j;
                                var forecastTempOne = (responseThree.list[i].main.temp_max - 273.15) * 9 / 5 + 32
                                var forecastFahrenheitOne = $('<p>');
                                var forecastHumidityOne = $('<p>');
                                var forecastWeatherOne = responseThree.list[i].weather[0].icon;
                                var weatherIconOne = 'https://openweathermap.org/img/wn/' + forecastWeatherOne + ".png";
                                var iconDisplayOne = $('<img>')
                                iconDisplayOne.attr('src', weatherIconOne);
                                forecastFahrenheitOne.text("Temp: " + forecastTempOne.toFixed(1) + "°F");
                                forecastHumidityOne.text("Humidity: " + responseThree.list[i].main.humidity + '%');
                                $(selector).append(forecastFahrenheitOne);
                                $(selector).append(forecastHumidityOne);
                                $(selector).append(iconDisplayOne);
                                j++;
                            }
                        }

                    })
            })


    }

    


});


